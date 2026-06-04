const router = require("express").Router();
const { protect, optionalAuth } = require("../middleware/auth");
const authController = require("../controllers/authController");
const feedController = require("../controllers/feedController");
const campController = require("../controllers/campController");
const userController = require("../controllers/userController");
const supportController = require("../controllers/supportController");
const Track = require("../models/Track");

// Auth
router.use("/auth", require("./auth"));

// Feed
router.get("/feed", optionalAuth, feedController.getFeed);
router.post("/posts", protect, feedController.createPost);
router.post("/posts/:id/like", protect, feedController.likePost);
router.post("/posts/:id/comment", protect, feedController.commentPost);

// Camps
router.get("/camps", optionalAuth, campController.getCamps);
router.post("/camps/:id/join", protect, campController.joinCamp);
router.get("/camps/:id/feed", optionalAuth, campController.getCampFeed);

// Users
router.get("/users/search", userController.searchUsers);
router.get("/users/:id", userController.getProfile);
router.patch("/users/me", protect, userController.updateProfile);
router.post("/users/onboarding", protect, userController.completeOnboarding);
router.post("/users/:id/follow", protect, userController.followUser);

// Tracks
router.post("/tracks", protect, async (req, res) => {
  try {
    const { title, audioUrl, coverArt, genre, caption, duration } = req.body;
    if (!title || !audioUrl) return res.status(400).json({ message: "title and audioUrl are required" });
    const track = await Track.create({ artistId: req.user._id, title, audioUrl, coverArt, genre, caption, duration: duration || 0 });
    await track.populate("artistId", "username avatar verified");
    // Also create a music post in the feed
    const Post = require("../models/Post");
    await Post.create({ userId: req.user._id, type: "music", trackId: track._id, content: caption || "", isPublic: true });
    return res.status(201).json({ track });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/tracks", optionalAuth, async (req, res) => {
  try {
    const tracks = await Track.find({ isPublic: true }).populate("artistId", "username avatar verified").sort({ createdAt: -1 }).limit(20);
    return res.json({ tracks });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

// Support
router.post("/support/initiate", protect, supportController.initiate);
router.post("/support/verify", protect, supportController.verify);
router.get("/support/history", protect, supportController.getHistory);

// Camperboard
router.get("/camperboard", async (req, res) => {
  try {
    const { country, period = "all" } = req.query;
    const User = require("../models/User");
    const query = country && country !== "Global" ? { country } : {};
    const users = await User.find(query).select("username avatar country points campsJoined").sort({ points: -1 }).limit(50);
    const board = users.map((u, i) => ({ rank: i + 1, user: u, points: u.points, country: u.country }));
    return res.json({ board });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

// Health check
router.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

module.exports = router;
