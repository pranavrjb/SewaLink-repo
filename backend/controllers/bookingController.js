const Booking = require("../models/Booking");
const Service = require("../models/Service");
const { sendNotification } = require("../utils/notification");

// Create Booking
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

    // Notify provider with enriched payload
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Provider gets all bookings
exports.getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      "service.provider": req.user.userId,
    }).populate("service");

    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// User gets my bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.userId,
    }).populate("service");

    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Provider updates booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("service");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.service.provider.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = req.body.status;
    await booking.save();

    res.status(200).json({ message: "Booking status updated", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("service");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user.userId) return res.status(403).json({ message: "Not authorized" });

    booking.status = "Cancelled";
    await booking.save();

    await sendNotification(booking.service.provider, {
      type: "BOOKING_CANCELLED",
      message: `Booking for ${booking.service.title} has been cancelled by user`,
      bookingId: booking._id,
      serviceTitle: booking.service.title,
      userName: req.user.name,
      status: booking.status,
    });

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Complete Booking
exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("service");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.service.provider.toString() !== req.user.userId) return res.status(403).json({ message: "Not authorized" });

    booking.status = "Completed";
    await booking.save();

    await sendNotification(booking.user, {
      type: "BOOKING_COMPLETED",
      message: `Your booking for ${booking.service.title} is completed`,
      bookingId: booking._id,
      serviceTitle: booking.service.title,
      status: booking.status,
    });

    res.json({ message: "Booking marked as completed", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
