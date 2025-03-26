const express = require("express");
const router = express.Router();
const interestController = require("../controllers/interestRatesController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to get
router.get("/", interestController.getInterestRates);

// Admin-only: update page-level info
router.post(
  "/",
  // authMiddleware,
  // adminMiddleware,
  interestController.uploadInterestImageMiddleware,
  interestController.updateInterestRates
);

module.exports = router;
