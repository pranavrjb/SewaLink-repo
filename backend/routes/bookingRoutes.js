const express = require("express");
const router = express.Router();
const auth = require("../middleware/bookingAuth");
const providerAuth = require("../middleware/providerMiddleware");

const {
  createBooking,
  getProviderBookings,
  getUserBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

// User creates a booking
router.post("/book", auth, createBooking);

// Provider gets all bookings
router.get("/provider", auth, providerAuth, getProviderBookings);

// User gets own bookings
router.get("/my", auth, getUserBookings);

// Provider updates booking status
router.patch("/:bookingId/status", auth, providerAuth, updateBookingStatus);

module.exports = router;

