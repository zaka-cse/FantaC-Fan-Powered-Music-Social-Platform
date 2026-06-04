const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  avatar: { type: String, default: null },
  banner: { type: String, default: null },
  bio: { type: String, default: "" },
  country: { type: String, default: "NG" },
  isArtist: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  provider: { type: String, enum: ["email", "google", "apple"], default: "email" },
  providerId: { type: String, default: null },
  genres: [{ type: String }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  campsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Camp" }],
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastStreakDate: { type: Date, default: null },
  onboardingComplete: { type: Boolean, default: false },
  refreshToken: { type: String, select: false },
}, { timestamps: true });

userSchema.pre("save", async function() {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.virtual("followerCount").get(function() { return this.followers.length; });
userSchema.virtual("followingCount").get(function() { return this.following.length; });

module.exports = mongoose.model("User", userSchema);
