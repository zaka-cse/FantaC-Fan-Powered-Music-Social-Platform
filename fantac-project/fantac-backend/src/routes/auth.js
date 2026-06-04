const router = require("express").Router();
const { signup, login, oauthLogin, refresh, logout, me } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: "Too many attempts, try again later" });

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/oauth", oauthLogin);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", protect, me);

module.exports = router;
