const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true }, // e.g., 'new_booking', 'booking_update', 'new_review'
    message: { type: String, required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" }, // optional
    review: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },   // optional
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
