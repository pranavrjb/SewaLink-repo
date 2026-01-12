const User = require("../models/User");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all services (FIXED - was duplicate of getAllUsers)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("provider", "name email")
      .sort({ createdAt: -1 });
    res.json({ services });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate({
        path: "service",
        select: "title category price provider",
        populate: {
          path: "provider",
          select: "name email"
        }
      })
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get admin stats
exports.getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProviders,
      totalBookings,
      pendingProviders,
      pendingBookings,
      completedBookings,
      reportedIssues
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "provider" }),
      Booking.countDocuments(),
      User.countDocuments({ role: "provider", status: "pending" }),
      Booking.countDocuments({ status: "pending" }),
      Booking.find({ status: "completed" }).populate("service", "price"),
      // You'll need a Report model for this, or use 0 for now
      Promise.resolve(0)
    ]);

    // Calculate total revenue from completed bookings
    const totalRevenue = completedBookings.reduce((sum, booking) => {
      return sum + (booking.service?.price || 0);
    }, 0);

    res.json({
      totalUsers,
      totalProviders,
      totalBookings,
      totalRevenue,
      pendingProviders,
      pendingBookings,
      reportedIssues
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin self-delete
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete related data
    await Booking.deleteMany({ user: userId });
    await Review.deleteMany({ user: userId });

    if (user.role === "provider") {
      await Service.deleteMany({ provider: userId });
    }

    await user.deleteOne();

    res.json({ message: "User and related data deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Change user role
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    const allowedRoles = ["user", "provider", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Prevent admin from changing own role
    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Role updated successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user status (suspend/activate)
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = ["active", "suspended", "pending"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Prevent admin from suspending themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "You cannot change your own status" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: `User ${status === "suspended" ? "suspended" : "activated"} successfully`,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get additional stats
    let stats = {};
    if (user.role === "provider") {
      const [services, bookings, reviews] = await Promise.all([
        Service.countDocuments({ provider: user._id }),
        Booking.countDocuments({ service: { $in: await Service.find({ provider: user._id }).select("_id") } }),
        Review.find({ service: { $in: await Service.find({ provider: user._id }).select("_id") } })
      ]);

      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0;

      stats = {
        totalServices: services,
        totalBookings: bookings,
        averageRating: avgRating.toFixed(1),
        totalReviews: reviews.length
      };
    } else {
      const bookings = await Booking.countDocuments({ user: user._id });
      const reviews = await Review.countDocuments({ user: user._id });

      stats = {
        totalBookings: bookings,
        totalReviews: reviews
      };
    }

    res.json({ user, stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const updates = req.body;

    const service = await Service.findByIdAndUpdate(
      serviceId,
      updates,
      { new: true, runValidators: true }
    ).populate("provider", "name email");

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.json({ message: "Service updated successfully", service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // Delete related bookings and reviews
    await Booking.deleteMany({ service: serviceId });
    await Review.deleteMany({ service: serviceId });

    await service.deleteOne();

    res.json({ message: "Service and related data deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = ["pending", "accepted", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("user", "name email")
      .populate("service", "title category price");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get providers (including pending ones)
exports.getProviders = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { role: "provider" };
    
    if (status) {
      query.status = status;
    }

    const providers = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    // Get additional stats for each provider
    const providersWithStats = await Promise.all(
      providers.map(async (provider) => {
        const services = await Service.countDocuments({ provider: provider._id });
        const bookings = await Booking.countDocuments({
          service: { $in: await Service.find({ provider: provider._id }).select("_id") }
        });

        return {
          ...provider.toObject(),
          stats: {
            totalServices: services,
            totalBookings: bookings
          }
        };
      })
    );

    res.json({ providers: providersWithStats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve provider
exports.approveProvider = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "provider") {
      return res.status(400).json({ message: "User is not a provider" });
    }

    user.status = "active";
    await user.save();

    res.json({
      message: "Provider approved successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get dashboard overview
exports.getDashboardOverview = async (req, res) => {
  try {
    const [
      recentUsers,
      recentBookings,
      recentServices,
      stats
    ] = await Promise.all([
      User.find().select("-password").sort({ createdAt: -1 }).limit(10),
      Booking.find()
        .populate("user", "name email")
        .populate("service", "title category price")
        .sort({ createdAt: -1 })
        .limit(10),
      Service.find()
        .populate("provider", "name email")
        .sort({ createdAt: -1 })
        .limit(10),
      this.getAdminStats(req, res)
    ]);

    res.json({
      recentUsers,
      recentBookings,
      recentServices
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};