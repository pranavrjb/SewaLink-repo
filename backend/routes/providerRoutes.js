const express = require("express");
const router = express.Router();
const { getProviderProfile } = require("../controllers/providerController");

// PUBLIC provider profile
router.get("/:id", getProviderProfile);

module.exports = router;
