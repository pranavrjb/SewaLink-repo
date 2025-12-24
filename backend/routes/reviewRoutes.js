const express = require("express");
const router = express.Router();
const authMiddleware  = require("../middleware/authMiddleware");
const { addReview, getServiceReviews, getServiceRating } = require("../controllers/reviewController");

// Protected route
router.post("/add-review", authMiddleware, addReview);

// Public routes
router.get("/service/:serviceId", getServiceReviews);
router.get("/service/:serviceId/rating", getServiceRating);

module.exports = router;
