const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["text", "media", "music", "poll"], default: "text" },
  content: { type: String, default: "" },
  media: [{ type: String }],
  trackId: { type: mongoose.Schema.Types.ObjectId, ref: "Track", default: null },
  campId: { type: mongoose.Schema.Types.ObjectId, ref: "Camp", default: null },
  campTag: { type: String, default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],
  shares: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
  isCampOnly: { type: Boolean, default: false },
}, { timestamps: true });

postSchema.virtual("likeCount").get(function() { return this.likes.length; });
postSchema.virtual("commentCount").get(function() { return this.comments.length; });

module.exports = mongoose.model("Post", postSchema);
