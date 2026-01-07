const Notification = require("../models/Notification");
const socket = require("./socket");

/**
 * @param {string} userId 
 * @param {object} payload
 * @param {string} payload.type 
 * @param {string} payload.message 
 * @param {string} [payload.bookingId] 
 * @param {string} [payload.reviewId] 
 */
const sendNotification = async (userId, payload) => {
  try {
    console.log("=== SEND NOTIFICATION ===");
    console.log("User ID:", userId);
    console.log("Payload:", payload);

    // Validate required fields
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (!payload.type) {
      throw new Error("Notification type is required");
    }
    if (!payload.message) {
      throw new Error("Notification message is required");
    }

    // Save notification in MongoDB
    console.log("Creating notification in database...");
    const notification = await Notification.create({
      user: userId,
      type: payload.type,
      message: payload.message,
      booking: payload.bookingId || null,
      review: payload.reviewId || null,
    });

    console.log("✅ Notification saved to database:", notification._id);

    // Send notification via Socket.io
    try {
      console.log("Sending notification via socket to user:", userId);
      socket.sendNotification(userId, {
        _id: notification._id,
        user: userId,
        type: payload.type,
        message: payload.message,
        booking: payload.bookingId,
        review: payload.reviewId,
        isRead: false,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      });
      console.log("✅ Socket notification sent");
    } catch (socketError) {
      console.warn("⚠️ Socket notification failed (user might be offline):", socketError.message);
      // Don't throw error here - it's OK if socket fails (user might be offline)
    }

    console.log("========================");
    return notification;
  } catch (err) {
    console.error("❌ Notification Error:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      userId: userId,
      payload: payload
    });
    throw new Error("Failed to send notification");
  }
};

module.exports = { sendNotification };