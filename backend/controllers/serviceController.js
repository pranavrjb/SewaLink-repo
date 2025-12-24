const Service = require("../models/Service");
const Review = require("../models/Review");

/* ===============================
   Helper: Update service rating
================================ */
const updateServiceRating = async (serviceId) => {
  const reviews = await Review.find({ service: serviceId });

  const ratingsCount = reviews.length;
  const ratingsSum = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = ratingsCount ? ratingsSum / ratingsCount : 0;

  await Service.findByIdAndUpdate(serviceId, {
    ratings: avgRating.toFixed(1),
    reviewsCount: ratingsCount,
  });
};

/* ===============================
   Controllers
================================ */

// GET all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD service
const addService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   EXPORTS (THIS IS CRITICAL)
================================ */
module.exports = {
  addService,
  getServices,
  getServiceById,
  deleteService,
  updateServiceRating, // optional export
};
