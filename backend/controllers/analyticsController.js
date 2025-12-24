const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Review = require("../models/Review");
const User = require("../models/User");

// Get booking stats
exports.bookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const completed = await Booking.countDocuments({ status: "Completed" });
    const cancelled = await Booking.countDocuments({ status: "Cancelled" });
    res.json({ totalBookings, completed, cancelled });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get popular services
exports.popularServices = async (req, res) => {
  try {
    const services = await Booking.aggregate([
      { $group: { _id: "$service", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      { $project: { "service.title": 1, count: 1 } },
    ]);
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get top-rated providers
exports.topRatedProviders = async (req, res) => {
  try {
    const providers = await Review.aggregate([
      {
        $group: {
          _id: "$service",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      { $sort: { avgRating: -1 } },
      { $limit: 5 },
      { $project: { "service.title": 1, avgRating: 1, totalReviews: 1 } },
    ]);
    res.json(providers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// User stats
exports.userStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const providers = await User.countDocuments({ role: "provider" });
    const customers = await User.countDocuments({ role: "user" });
    res.json({ totalUsers, providers, customers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
