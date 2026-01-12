const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware  = require("../middleware/authMiddleware");
const {adminMiddleware}  = require("../middleware/adminAuth");

// Protect all admin routes
router.use(authMiddleware, adminMiddleware);

// Dashboard & Stats
router.get("/stats", adminController.getAdminStats);
router.get("/dashboard", adminController.getDashboardOverview);

// User routes
router.get("/users", adminController.getAllUsers);
router.get("/user/:id", adminController.getUserDetails);
router.put("/user/:id/role", adminController.changeUserRole);
router.put("/user/:id/status", adminController.updateUserStatus);
router.delete("/user/:id", adminController.deleteUser);

// Provider routes
router.get("/providers", adminController.getProviders);
router.put("/provider/:id/approve", adminController.approveProvider);

// Service routes
router.get("/services", adminController.getAllServices);
router.put("/service/:id", adminController.updateService);
router.delete("/service/:id", adminController.deleteService);

// Booking routes
router.get("/bookings", adminController.getAllBookings);
router.put("/booking/:id/status", adminController.updateBookingStatus);

module.exports = router;