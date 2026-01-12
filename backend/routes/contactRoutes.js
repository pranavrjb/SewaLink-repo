const express = require("express");
const router = express.Router();

const { submitContactForm, getAllContacts } = require("../controllers/contactController");
const authMiddleware = require("../middleware/authMiddleware");
const {adminMiddleware}  = require("../middleware/adminAuth"); 

// Public route – anyone can submit contact form
router.post("/", submitContactForm);

// Admin route – protected
router.get("/", authMiddleware, adminMiddleware, getAllContacts);

module.exports = router;
