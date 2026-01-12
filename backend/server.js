// server.js
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();
const socket = require("./utils/socket");
const app = require("./app");
const jwt = require("jsonwebtoken");

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:8081", process.env.FRONTEND_URL], 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socket.init(io);
io.use((socketIo, next) => {
  const token = socketIo.handshake.auth?.token;
  if (!token) return next(new Error("Unauthorized"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socketIo.userId = decoded.id; 
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

// Handle client connections
io.on("connection", (socketIo) => {
  console.log("New client connected:", socketIo.userId);

  // Register user for notifications
  socket.registerUser(socketIo.userId, socketIo.id);
  console.log("User registered for notifications:", socketIo.userId);

  socketIo.on("disconnect", () => {
    socket.removeSocket(socketIo.id);
    console.log("Client disconnected:", socketIo.userId);
  });
});

// Connect MongoDB & start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = { server, io, socket };
