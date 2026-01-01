const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app"); 

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

// Store online users
const onlineUsers = new Map();

// Listen for client connections
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Listen for user login to store socket id
  socket.on("register_user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Remove from onlineUsers on disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) onlineUsers.delete(key);
    }
  });
});

// Utility to send notification via Socket.io
const sendNotification = (userId, notification) => {
  const socketId = onlineUsers.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit("notification", notification);
  }
};

module.exports = { server, sendNotification };

// Connect MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
