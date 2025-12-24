const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const { sendNotification } = require("../utils/notification");

// Add Review
exports.addReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const booking = await Booking.findById(bookingId).populate("service");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });
    if (booking.status !== "Completed")
      return res.status(400).json({ message: "Cannot review incomplete booking" });

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview)
      return res.status(400).json({ message: "You have already reviewed this booking" });

    const review = await Review.create({
      booking: bookingId,
      service: booking.service._id,
      user: req.user.userId,
      rating,
      comment,
    });

    await sendNotification(booking.service.provider, {
      type: "NEW_REVIEW",
      message: `New review from ${req.user.name} for ${booking.service.title}`,
      reviewId: review._id,
      serviceTitle: booking.service.title,
      userName: req.user.name,
      rating,
    });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get reviews for a service
exports.getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId });
    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get average rating for a service
exports.getServiceRating = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId });
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;
    res.status(200).json({ averageRating: avgRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
