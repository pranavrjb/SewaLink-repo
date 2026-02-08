const express = require("express");
const router = express.Router();
const auth = require("../middleware/bookingAuth"); // Ensure this path matches your auth middleware
const providerAuth = require("../middleware/providerMiddleware");

const {
  createBooking,
  getProviderBookings,
  getUserBookings,
  updateBookingStatus,
  cancelBooking, // <--- Imported here
} = require("../controllers/bookingController");

// User creates a booking
router.post("/book", auth, createBooking);

// Provider gets all bookings
router.get("/provider", auth, providerAuth, getProviderBookings);

// User gets own bookings
router.get("/my", auth, getUserBookings);

// Provider updates booking status
router.patch("/:bookingId/status", auth, providerAuth, updateBookingStatus);

// Cancel booking (User or Provider)
// This route was causing the "Undefined" error before because it wasn't in the controller
router.patch("/:bookingId/cancel", auth, cancelBooking);

module.exports = router;