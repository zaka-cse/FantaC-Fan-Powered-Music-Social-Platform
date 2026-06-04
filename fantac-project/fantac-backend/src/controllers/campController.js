const Camp = require("../models/Camp");
const User = require("../models/User");

// GET /api/camps
exports.getCamps = async (req, res) => {
  try {
    const camps = await Camp.find().populate("artistId", "username avatar verified").sort({ createdAt: -1 });
    const formatted = camps.map(c => ({
      _id: c._id,
      artistId: c.artistId._id,
      artist: c.artistId,
      campName: c.campName,
      country: c.country,
      memberCount: c.members.length,
      isJoined: req.user ? c.members.includes(req.user._id) : false,
    }));
    return res.json({ camps: formatted });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/camps/:id/join
exports.joinCamp = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) return res.status(404).json({ message: "Camp not found" });

    const isMember = camp.members.includes(req.user._id);
    if (isMember) {
      camp.members = camp.members.filter(m => m.toString() !== req.user._id.toString());
      await User.findByIdAndUpdate(req.user._id, { $pull: { campsJoined: camp._id } });
    } else {
      camp.members.push(req.user._id);
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { campsJoined: camp._id } });
    }
    await camp.save();
    return res.json({ memberCount: camp.members.length, isJoined: !isMember });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/camps/:id/feed
exports.getCampFeed = async (req, res) => {
  try {
    const Post = require("../models/Post");
    const posts = await Post.find({ campId: req.params.id })
      .populate("userId", "username avatar verified isArtist")
      .sort({ createdAt: -1 })
      .limit(20);
    return res.json({ posts });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};
