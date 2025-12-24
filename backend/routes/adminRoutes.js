const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getAllServices,
  getAllBookings,
  deleteUser,
  deleteService,
} = require("../controllers/adminController");
const authMiddleware  = require("../middleware/authMiddleware");
const  adminMiddleware  = require("../middleware/adminAuth");

// Protected admin routes
router.use(authMiddleware, adminMiddleware);

router.get("/users", getAllUsers);
router.get("/services", getAllServices);
router.get("/bookings", getAllBookings);
router.delete("/user/:id", deleteUser);
router.delete("/service/:id", deleteService);

module.exports = router;
