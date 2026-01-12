const Service = require("../models/Service");
const Review = require("../models/Review");
const User = require("../models/User");

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const services = await Service.find(query)
      .populate("provider", "name email")
      .sort({ createdAt: -1 });

    res.json({ services });
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single service
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("provider", "name email phone location avatar bio");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ service });
  } catch (error) {
    console.error("Get service error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get provider profile with all services and reviews
exports.getProviderProfile = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Get provider information
    const provider = await User.findById(providerId).select("-password");

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    if (provider.role !== "provider") {
      return res.status(400).json({ message: "User is not a provider" });
    }

    // Get all services by this provider
    const services = await Service.find({ provider: providerId }).sort({ createdAt: -1 });

    // Get all reviews for this provider's services
    const serviceIds = services.map(s => s._id);
    const reviews = await Review.find({ service: { $in: serviceIds } })
      .populate("user", "name email avatar")
      .populate("service", "title")
      .sort({ createdAt: -1 });

    // Calculate stats
    const stats = {
      totalServices: services.length,
      totalReviews: reviews.length,
      averageRating: reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0,
    };

    res.json({
      provider: {
        _id: provider._id,
        name: provider.name,
        email: provider.email,
        phone: provider.phone,
        avatar: provider.avatar,
        bio: provider.bio,
        location: provider.location,
        createdAt: provider.createdAt,
        role: provider.role,
      },
      services,
      reviews,
      stats,
    });
  } catch (error) {
    console.error("Get provider profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create service (provider only)
exports.createService = async (req, res) => {
  try {
    const { title, description, category, price, location } = req.body;

    if (!title || !description || !category || !price) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const service = await Service.create({
      title,
      description,
      category,
      price,
      location,
      provider: req.user._id,
    });

    const populatedService = await Service.findById(service._id)
      .populate("provider", "name email");

    res.status(201).json({ 
      message: "Service created successfully", 
      service: populatedService 
    });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update service (provider only)
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check if user is the service provider
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this service" });
    }

    const { title, description, category, price, location } = req.body;

    if (title) service.title = title;
    if (description) service.description = description;
    if (category) service.category = category;
    if (price) service.price = price;
    if (location !== undefined) service.location = location;

    await service.save();

    const updatedService = await Service.findById(service._id)
      .populate("provider", "name email");

    res.json({ 
      message: "Service updated successfully", 
      service: updatedService 
    });
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete service (provider only)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check if user is the service provider
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this service" });
    }

    // Delete related reviews
    await Review.deleteMany({ service: service._id });

    await service.deleteOne();

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get services by category
exports.getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const services = await Service.find({ category })
      .populate("provider", "name email")
      .sort({ createdAt: -1 });

    res.json({ services });
  } catch (error) {
    console.error("Get services by category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Search services
exports.searchServices = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const services = await Service.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    })
      .populate("provider", "name email")
      .sort({ createdAt: -1 });

    res.json({ services });
  } catch (error) {
    console.error("Search services error:", error);
    res.status(500).json({ message: "Server error" });
  }
};