const Post = require("../models/Post");

// GET /api/feed?type=for_you&page=1
exports.getFeed = async (req, res) => {
  try {
    const { type = "for_you", page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    let query = { isPublic: true };

    if (type === "following" && req.user) {
      query.userId = { $in: req.user.following };
    } else if (type === "camps" && req.user) {
      query.campId = { $in: req.user.campsJoined };
    }

    const posts = await Post.find(query)
      .populate("userId", "username avatar verified isArtist")
      .populate({ path: "trackId", populate: { path: "artistId", select: "username avatar verified" } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const formatted = posts.map(p => ({
      _id: p._id,
      userId: p.userId._id,
      user: p.userId,
      type: p.type,
      content: p.content,
      media: p.media,
      track: p.trackId,
      campTag: p.campTag,
      likes: p.likes.length,
      comments: p.comments.length,
      isLiked: req.user ? p.likes.includes(req.user._id) : false,
      createdAt: p.createdAt,
    }));

    return res.json({ posts: formatted, page: Number(page), hasMore: posts.length === Number(limit) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { type, content, media, trackId, campId, campTag, isCampOnly } = req.body;
    const post = await Post.create({ userId: req.user._id, type, content, media, trackId, campId, campTag, isCampOnly });
    await post.populate("userId", "username avatar verified isArtist");
    return res.status(201).json({ post });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/posts/:id/like
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const idx = post.likes.indexOf(req.user._id);
    if (idx === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(idx, 1);
    }
    await post.save();
    return res.json({ likes: post.likes.length, isLiked: idx === -1 });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/posts/:id/comment
exports.commentPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Comment cannot be empty" });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.comments.push({ userId: req.user._id, content });
    await post.save();
    return res.json({ comments: post.comments.length });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};
