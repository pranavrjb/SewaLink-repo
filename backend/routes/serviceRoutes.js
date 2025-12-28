const express = require("express");
const router = express.Router();

const {
  addService,
  getServices,
  getServiceById,
  deleteService,
  getServicesByProvider,
} = require("../controllers/serviceController");

const serviceAuth = require("../middleware/serviceAuth");

// PUBLIC
router.get("/", getServices);

// ⚠️ provider route MUST be before :id
router.get("/provider/:providerId", getServicesByProvider);

router.get("/:id", getServiceById);

// PROTECTED (provider only)
router.post("/add", serviceAuth, addService);
router.delete("/:id", serviceAuth, deleteService);

module.exports = router;
