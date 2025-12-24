const express = require("express");
const router = express.Router();
const {
  addService,
  getServices,
  getServiceById,
  deleteService,
} = require("../controllers/serviceController");

const authMiddleware = require("../middleware/serviceAuth");
// Public routes
router.get("/", getServices);
router.get("/:id", getServiceById);

// Protected routes (providers only)
router.post("/add", authMiddleware, addService);
router.delete("/:id", authMiddleware, deleteService);

module.exports = router;
