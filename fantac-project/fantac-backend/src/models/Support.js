const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toArtistId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "NGN" },
  isCampMember: { type: Boolean, default: false },
  campId: { type: mongoose.Schema.Types.ObjectId, ref: "Camp", default: null },
  paystackRef: { type: String, unique: true, sparse: true },
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  pointsEarned: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Support", supportSchema);
