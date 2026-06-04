const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  coverArt: { type: String, default: null },
  audioUrl: { type: String, required: true },
  duration: { type: Number, default: 0 },
  genre: { type: String, default: "" },
  caption: { type: String, default: "" },
  plays: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isPublic: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Track", trackSchema);
