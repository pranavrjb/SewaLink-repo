const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
  addReview, 
  getServiceReviews, 
  getServiceRating,
  getUserReviews,
  updateReview,
  deleteReview,
  getProviderReviews,
  getAllPublicReviews
} = require("../controllers/reviewController");

// Protected routes (require authentication)
router.post("/add-review", authMiddleware, addReview);
router.get("/my-reviews", authMiddleware, getUserReviews);
router.get("/provider-reviews", authMiddleware, getProviderReviews); // NEW - Get provider's reviews
router.put("/:reviewId", authMiddleware, updateReview);
router.delete("/:reviewId", authMiddleware, deleteReview);

// Public routes (no authentication required)
router.get("/service/:serviceId", getServiceReviews);
router.get("/service/:serviceId/rating", getServiceRating);
router.get("/public", getAllPublicReviews);

module.exports = router;