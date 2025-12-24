const express = require("express");
const router = express.Router();

const { submitContactForm, getAllContacts } = require("../controllers/contactController");
const authMiddleware = require("../middleware/authMiddleware");
const { adminAuth } = require("../middleware/adminAuth");

// Public route
router.post("/", submitContactForm);

// Admin route
router.get("/", authMiddleware, adminAuth, getAllContacts);

module.exports = router;
