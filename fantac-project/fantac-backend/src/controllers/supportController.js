const Support = require("../models/Support");
const User = require("../models/User");

const POINTS_PER_NAIRA = 0.1;

// POST /api/support/initiate
exports.initiate = async (req, res) => {
  try {
    const { artistId, amount, campId } = req.body;
    if (!artistId || !amount) return res.status(400).json({ message: "Artist and amount required" });

    const artist = await User.findById(artistId);
    if (!artist) return res.status(404).json({ message: "Artist not found" });

    // Generate Paystack payment link via their API
    const ref = `fantac_${Date.now()}_${req.user._id}`;
    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: req.user.email,
        amount: amount * 100, // Paystack uses kobo
        reference: ref,
        metadata: { artistId, campId, fromUserId: req.user._id.toString() },
        callback_url: `${process.env.FRONTEND_URL}/support/callback`,
      }),
    });

    if (!paystackRes.ok) {
      return res.status(500).json({ message: "Payment initiation failed" });
    }

    const data = await paystackRes.json();

    const support = await Support.create({
      fromUserId: req.user._id,
      toArtistId: artistId,
      amount,
      isCampMember: !!campId,
      campId: campId || null,
      paystackRef: ref,
      status: "pending",
    });

    return res.json({ authorizationUrl: data.data.authorization_url, reference: ref });
  } catch (err) {
    console.error("Support initiate error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/support/verify
exports.verify = async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ message: "Reference required" });

    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });

    const data = await paystackRes.json();
    if (!data.data || data.data.status !== "success") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    const support = await Support.findOneAndUpdate(
      { paystackRef: reference },
      { status: "success" },
      { new: true }
    );

    if (!support) return res.status(404).json({ message: "Support record not found" });

    const points = Math.floor(support.amount * POINTS_PER_NAIRA);
    await User.findByIdAndUpdate(support.fromUserId, { $inc: { points } });

    return res.json({ success: true, points });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/support/history
exports.getHistory = async (req, res) => {
  try {
    const history = await Support.find({ fromUserId: req.user._id, status: "success" })
      .populate("toArtistId", "username avatar verified")
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ history });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};
