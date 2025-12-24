const Notification = require("../models/Notification");
const { sendNotification: ioSendNotification } = require("../server");

// Send enriched notifications
exports.sendNotification = async (userId, payload) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type: payload.type,
      message: payload.message,
      booking: payload.bookingId,
      review: payload.reviewId,
      isRead: false,
    });

    // Emit real-time notification with enriched payload
    ioSendNotification(userId, {
      ...payload,
      notificationId: notification._id,
      createdAt: notification.createdAt,
    });

    return notification;
  } catch (err) {
    console.error("Notification Error:", err);
  }
};
