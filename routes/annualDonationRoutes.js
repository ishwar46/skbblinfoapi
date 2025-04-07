const express = require("express");
const router = express.Router();
const annualDonationController = require("../controllers/annualDonationController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint: Get the Annual Donation page details
router.get("/", annualDonationController.getAnnualDonationPage);

// Admin-only endpoint: Update the page-level info
router.put("/", authMiddleware, adminMiddleware, annualDonationController.updateAnnualDonationPage);

// Admin-only endpoint: Add a new donation entry
router.post("/items", authMiddleware, adminMiddleware, annualDonationController.addDonationEntry);

// Admin-only endpoint: Update an existing donation entry
router.patch("/items/:donationId", authMiddleware, adminMiddleware, annualDonationController.updateDonationEntry);

// Admin-only endpoint: Delete a donation entry
router.delete("/items/:donationId", authMiddleware, adminMiddleware, annualDonationController.deleteDonationEntry);

module.exports = router;
