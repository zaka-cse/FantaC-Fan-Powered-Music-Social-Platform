require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
});

// Online users map
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("user:join", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(`user:${userId}`);
  });

  socket.on("post:like", ({ postId, userId, likes }) => {
    io.emit("post:liked", { postId, userId, likes });
  });

  socket.on("post:comment", ({ postId, comment }) => {
    io.emit("post:commented", { postId, comment });
  });

  socket.on("camp:join", ({ campId, userId }) => {
    socket.join(`camp:${campId}`);
    io.to(`camp:${campId}`).emit("camp:member_joined", { campId, userId });
  });

  socket.on("support:sent", ({ artistId, amount }) => {
    const artistSocket = onlineUsers.get(artistId);
    if (artistSocket) {
      io.to(artistSocket).emit("support:received", { amount });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// Attach io to app for use in controllers
app.set("io", io);

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global rate limit
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Routes
app.use("/api", routes);

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

// Connect DB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => console.log(`FantaC server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

module.exports = { app, io };
