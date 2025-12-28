const { get } = require("mongoose");
const Service = require("../models/Service");

// GET all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("provider", "name email phone");

    res.status(200).json({ services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("provider", "name email phone");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/serviceController.js
const getServicesByProvider = async (req, res) => {
  try {
    const services = await Service.find({ provider: req.params.providerId });
    res.status(200).json({ services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD service (provider only)
const addService = async (req, res) => {
  try {
    const service = await Service.create({
      ...req.body,
      provider: req.user.userId,
    });

    res.status(201).json({
      message: "Service created successfully",
      service,
    });
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

module.exports = {
  getServices,
  getServiceById,
  addService,
  deleteService,
  getServicesByProvider,
};
