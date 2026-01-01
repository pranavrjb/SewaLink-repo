let io;
const onlineUsers = new Map();

module.exports = {
  init: (serverIo) => {
    io = serverIo;
  },

  registerUser: (userId, socketId) => {
    onlineUsers.set(userId.toString(), socketId);
  },

  removeSocket: (socketId) => {
    for (let [userId, sId] of onlineUsers.entries()) {
      if (sId === socketId) onlineUsers.delete(userId);
    }
  },

  sendNotification: (userId, notification) => {
    const socketId = onlineUsers.get(userId.toString());
    if (socketId && io) {
      io.to(socketId).emit("notification", notification);
    }
  }
};
