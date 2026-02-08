const Booking = require("../models/Booking");
const Service = require("../models/Service");
const { sendNotification } = require("../utils/notification");

exports.createBooking = async (req, res) => {
  try {
    const { serviceId, serviceAddress, preferredDate, notes } = req.body;
    const booking = await Booking.create({
      user: req.user.userId,
      service: serviceId,
      serviceAddress,
      preferredDate,
      notes,
    });

    const service = await Service.findById(serviceId).populate("provider", "name");

    if (service) {
      try {
        await sendNotification(service.provider._id, {
          type: "NEW_BOOKING",
          message: `New booking from ${req.user.name} for ${service.title}`,
          bookingId: booking._id,
          serviceTitle: service.title,
          userName: req.user.name,
          preferredDate: booking.preferredDate,
          status: booking.status,
        });
      } catch (err) {
        console.error("Provider notification failed:", err);
      }

      try {
        await sendNotification(req.user.userId, {
          type: "BOOKING_CONFIRMED",
          message: `Your booking for ${service.title} has been created successfully.`,
          bookingId: booking._id,
          serviceTitle: service.title,
          preferredDate: booking.preferredDate,
          status: booking.status,
        });
      } catch (err) {
        console.error("User notification failed:", err);
      }
    }

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getProviderBookings = async (req, res) => {
  try {
    const providerId = req.user.userId;

    const bookings = await Booking.find()
      .populate({
        path: "service",
        match: { provider: providerId },
        populate: { path: "provider", select: "name email" },
      })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const filteredBookings = bookings.filter((b) => b.service);

    res.status(200).json({ bookings: filteredBookings });
  } catch (error) {
    console.error("Get provider bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).populate("service");
    res.status(200).json({ bookings });
  } catch (err) {
    console.error("Get user bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const providerId = req.user.userId;
    const booking = await Booking.findById(bookingId).populate("service");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.service.provider.toString() !== providerId.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    booking.status = status;
    await booking.save();

    try {
      await sendNotification(booking.user, {
        type: "BOOKING_STATUS_UPDATED",
        message: `Your booking for ${booking.service.title} is now ${status}.`,
        bookingId: booking._id,
        serviceTitle: booking.service.title,
        preferredDate: booking.preferredDate,
        status: booking.status,
      });
    } catch (err) {
      console.error("Status update notification failed:", err);
    }

    res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --- NEW FUNCTION ADDED HERE ---
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId; // Extracted from your auth middleware

    // Find the booking and populate service to access provider ID
    const booking = await Booking.findById(bookingId).populate("service");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check Authorization: User must be the "Customer" OR the "Provider"
    const isCustomer = booking.user.toString() === userId.toString();
    const isProvider = booking.service.provider.toString() === userId.toString();

    if (!isCustomer && !isProvider) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    // Prevent cancelling if already completed or cancelled
    if (["completed", "cancelled", "rejected"].includes(booking.status)) {
      return res.status(400).json({ message: "Booking cannot be cancelled in its current status" });
    }

    // Set new status: "rejected" if provider cancels, "cancelled" if user cancels
    const newStatus = isProvider ? "rejected" : "cancelled";
    booking.status = newStatus;
    await booking.save();

    // Send Notification
    try {
      // If Customer cancelled -> Notify Provider
      if (isCustomer) {
        await sendNotification(booking.service.provider, {
          type: "BOOKING_CANCELLED",
          message: `Booking cancelled by customer: ${booking.service.title}`,
          bookingId: booking._id,
        });
      }
      // If Provider rejected -> Notify Customer
      else if (isProvider) {
        await sendNotification(booking.user, {
          type: "BOOKING_REJECTED",
          message: `Your booking for ${booking.service.title} was rejected by the provider.`,
          bookingId: booking._id,
        });
      }
    } catch (notifError) {
      console.error("Notification failed:", notifError);
    }

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};