const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendTokens, generateAccessToken, generateRefreshToken } = require("../utils/tokens");

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password, isArtist = false, genre = "" } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(409).json({
        message: exists.email === email ? "Email already registered" : "Username already taken"
      });
    }

    const user = await User.create({ username, email, password, provider: "email", isArtist, genres: genre ? [genre] : [] });
    return sendTokens(res, user, 201);
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return sendTokens(res, user);
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/oauth  — called by NextAuth after Google/Apple sign in
exports.oauthLogin = async (req, res) => {
  try {
    const { provider, email, name, avatar, providerId } = req.body;
    if (!email || !provider) {
      return res.status(400).json({ message: "Missing OAuth data" });
    }

    let user = await User.findOne({ $or: [{ email }, { providerId }] });
    let isNewUser = false;

    if (!user) {
      const username = (name || email.split("@")[0]).replace(/\s+/g, "_").toLowerCase() + "_" + Date.now().toString(36);
      user = await User.create({ username, email, avatar, provider, providerId, onboardingComplete: false });
      isNewUser = true;
    } else {
      if (!user.avatar && avatar) { user.avatar = avatar; await user.save(); }
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return res.status(200).json({ user: userObj, accessToken, isNewUser });
  } catch (err) {
    console.error("OAuth error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/refresh
exports.refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const accessToken = generateAccessToken(user._id);
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out" });
};

// GET /api/auth/me
exports.me = async (req, res) => {
  return res.json({ user: req.user });
};
