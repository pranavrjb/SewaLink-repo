const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const providerMiddleware = require("../middleware/providerMiddleware");
const {
  getAllServices,
  getService,
  getProviderProfile,
  createService,
  updateService,
  deleteService,
  getServicesByCategory,
  searchServices,
} = require("../controllers/serviceController");

// Public routes
router.get("/", getAllServices);
router.get("/search", searchServices);
router.get("/category/:category", getServicesByCategory);
router.get("/provider/:providerId/profile", getProviderProfile); // NEW - Get provider profile with reviews
router.get("/:id", getService);

// Protected routes (require authentication)
router.post("/", authMiddleware, providerMiddleware, createService);
router.put("/:id", authMiddleware, providerMiddleware, updateService);
router.delete("/:id", authMiddleware, providerMiddleware, deleteService);

module.exports = router;