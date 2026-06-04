const mongoose = require("mongoose");

const campSchema = new mongoose.Schema({
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  campName: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, default: "" },
  coverImage: { type: String, default: null },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isOfficial: { type: Boolean, default: true },
}, { timestamps: true });

campSchema.virtual("memberCount").get(function() { return this.members.length; });

module.exports = mongoose.model("Camp", campSchema);
