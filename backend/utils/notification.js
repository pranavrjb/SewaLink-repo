const Notification = require("../models/Notification");
const { sendToUser } = require("./socket");

exports.sendNotification = async (userId, payload) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type: payload.type,
      message: payload.message,
      booking: payload.bookingId,
      review: payload.reviewId,
    });

    sendToUser(userId, "new_notification", {
      ...payload,
      notificationId: notification._id,
      createdAt: notification.createdAt,
    });

    return notification;
  } catch (err) {
    console.error("Notification Error:", err);
  }
};
