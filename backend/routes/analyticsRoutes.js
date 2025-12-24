const express = require("express");
const router = express.Router();
const {
  bookingStats,
  popularServices,
  topRatedProviders,
  userStats,
} = require("../controllers/analyticsController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminAuth");

// Protected admin analytics routes
router.use(authMiddleware, adminMiddleware);

router.get("/bookings", bookingStats);
router.get("/popular-services", popularServices);
router.get("/top-rated-providers", topRatedProviders);
router.get("/users", userStats);

module.exports = router;
