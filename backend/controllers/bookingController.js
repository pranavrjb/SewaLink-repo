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
      await sendNotification(service.provider._id, {
        type: "NEW_BOOKING",
        message: `New booking from ${req.user.name} for ${service.title}`,
        bookingId: booking._id,
        serviceTitle: service.title,
        userName: req.user.name,
        preferredDate: booking.preferredDate,
        status: booking.status,
      });
    }

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ message: "Server error" });
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

    const filteredBookings = bookings.filter(b => b.service);

    res.status(200).json({ bookings: filteredBookings });
  } catch (error) {
    console.error("Get provider bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate("service");

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

    res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
