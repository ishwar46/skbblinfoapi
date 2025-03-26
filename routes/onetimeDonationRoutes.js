const express = require("express");
const router = express.Router();
const onetimeDonationController = require("../controllers/onetimeDonationController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint: Get the OneTime Donation page details
router.get("/", onetimeDonationController.getOneTimeDonationPage);

// Admin-only endpoint: Update the page-level info
router.put(
  "/",
  authMiddleware,
  adminMiddleware,
  onetimeDonationController.updateOneTimeDonationPage
);

// Admin-only endpoint: Add a new donation entry
router.post(
  "/items",
  authMiddleware,
  adminMiddleware,
  onetimeDonationController.addDonationEntry
);

// Admin-only endpoint: Update an existing donation entry
router.patch(
  "/items/:donationId",
  authMiddleware,
  adminMiddleware,
  onetimeDonationController.updateDonationEntry
);

// Admin-only endpoint: Delete a donation entry
router.delete(
  "/items/:donationId",
  authMiddleware,
  adminMiddleware,
  onetimeDonationController.deleteDonationEntry
);

module.exports = router;
