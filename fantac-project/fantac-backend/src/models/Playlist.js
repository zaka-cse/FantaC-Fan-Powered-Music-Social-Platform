const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  coverArt: { type: String, default: null },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
  isPublic: { type: Boolean, default: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("Playlist", playlistSchema);
