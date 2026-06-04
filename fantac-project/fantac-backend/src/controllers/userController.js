const User = require("../models/User");

// GET /api/users/:id
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -refreshToken").populate("campsJoined");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/users/me
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, country, avatar } = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (country) updates.country = country;
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password -refreshToken");
    return res.json({ user });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users/onboarding
exports.completeOnboarding = async (req, res) => {
  try {
    const { genres, following, campId } = req.body;
    const updates = { onboardingComplete: true };
    if (genres) updates.genres = genres;

    await User.findByIdAndUpdate(req.user._id, updates);

    if (following?.length) {
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: { $each: following } } });
      await User.updateMany({ _id: { $in: following } }, { $addToSet: { followers: req.user._id } });
    }

    if (campId) {
      const Camp = require("../models/Camp");
      const camp = await Camp.findById(campId);
      if (camp) {
        camp.members.push(req.user._id);
        await camp.save();
        await User.findByIdAndUpdate(req.user._id, { $addToSet: { campsJoined: campId } });
      }
    }

    const user = await User.findById(req.user._id).select("-password -refreshToken");
    return res.json({ user });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users/:id/follow
exports.followUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "User not found" });

    const isFollowing = target.followers.includes(req.user._id);
    if (isFollowing) {
      await User.findByIdAndUpdate(target._id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: target._id } });
    } else {
      await User.findByIdAndUpdate(target._id, { $addToSet: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: target._id } });
    }
    return res.json({ isFollowing: !isFollowing });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/search?q=
exports.searchUsers = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json({ users: [] });
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ]
    }).select("username avatar verified isArtist").limit(20);
    return res.json({ users });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};
