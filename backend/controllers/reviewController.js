const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const { sendNotification } = require("../utils/notification");

// Add Review
exports.addReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({ message: "Booking ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const booking = await Booking.findById(bookingId).populate("service");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Debug logging
    console.log("Booking user:", booking.user);
    console.log("Req user ID:", req.user._id);
    console.log("Req user userId:", req.user.userId);

    if (!booking.user.equals(req.user._id)) {
      return res.status(403).json({ 
        message: "Not authorized to review this booking",
        debug: {
          bookingUserId: booking.user.toString(),
          requestUserId: req.user._id.toString()
        }
      });
    }

    // Check booking status (handle both "Completed" and "completed")
    const bookingStatus = booking.status.toLowerCase();
    if (bookingStatus !== "completed") {
      return res.status(400).json({ 
        message: "Cannot review incomplete booking",
        currentStatus: booking.status
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this booking" });
    }

    // Create review
    const review = await Review.create({
      booking: bookingId,
      service: booking.service._id,
      user: req.user._id,
      rating,
      comment: comment || "",
    });

    // Populate review for response
    const populatedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("service", "title");

    // Send notification to provider (with error handling)
    try {
      if (booking.service && booking.service.provider) {
        await sendNotification(booking.service.provider, {
          type: "NEW_REVIEW",
          message: `New review from ${req.user.name} for ${booking.service.title}`,
          reviewId: review._id,
          serviceTitle: booking.service.title,
          userName: req.user.name,
          rating,
        });
      }
    } catch (notifError) {
      console.error("Notification error:", notifError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({ 
      message: "Review added successfully", 
      review: populatedReview 
    });
  } catch (err) {
    console.error("Add review error:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get reviews for a service
exports.getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const reviews = await Review.find({ service: serviceId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reviews,
      count: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};


// Get average rating for a service
exports.getServiceRating = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const reviews = await Review.find({ service: serviceId });
    
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.status(200).json({ 
      averageRating: parseFloat(avgRating),
      totalReviews: reviews.length 
    });
  } catch (err) {
    console.error("Get rating error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reviews,
      count: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("service", "title category")
      .populate("booking")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      reviews,
      count: reviews.length 
    });
  } catch (err) {
    console.error("Get user reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns this review
    if (!review.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    const updatedReview = await Review.findById(reviewId)
      .populate("user", "name email")
      .populate("service", "title");

    res.status(200).json({ 
      message: "Review updated successfully", 
      review: updatedReview 
    });
  } catch (err) {
    console.error("Update review error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns this review
    if (!review.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get provider's reviews (all reviews for provider's services)
exports.getProviderReviews = async (req, res) => {
  try {
    // Find all services belonging to this provider
    const services = await Service.find({ provider: req.user._id }).select("_id");
    
    if (services.length === 0) {
      return res.status(200).json({ 
        reviews: [],
        count: 0,
        message: "No services found for this provider" 
      });
    }

    const serviceIds = services.map(s => s._id);

    // Find all reviews for these services
    const reviews = await Review.find({ service: { $in: serviceIds } })
      .populate("user", "name email avatar")
      .populate("service", "title category price")
      .populate("booking", "status createdAt")
      .sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      totalReviews: reviews.length,
      averageRating: reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0,
      ratingBreakdown: {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
      }
    };

    res.status(200).json({ 
      reviews,
      count: reviews.length,
      stats
    });
  } catch (err) {
    console.error("Get provider reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get provider's reviews (all reviews for provider's services)
exports.getProviderReviews = async (req, res) => {
  try {
    // Find all services belonging to this provider
    const services = await Service.find({ provider: req.user._id }).select("_id");
    const serviceIds = services.map(s => s._id);

    // Find all reviews for these services
    const reviews = await Review.find({ service: { $in: serviceIds } })
      .populate("user", "name email")
      .populate("service", "title category")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      reviews,
      count: reviews.length 
    });
  } catch (err) {
    console.error("Get provider reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};