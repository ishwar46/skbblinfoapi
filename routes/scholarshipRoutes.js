const express = require("express");
const router = express.Router();
const scholarshipController = require("../controllers/scholarshipController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public
router.get("/", scholarshipController.getScholarshipPage);

// Admin-only endpoint to update Scholarship page details (with file uploads).
router.patch(
  "/",
  authMiddleware,
  adminMiddleware,
  scholarshipController.uploadScholarshipQRMiddleware,
  scholarshipController.updateScholarshipPage
);
router.post(
  "/add-donation-methods",
  authMiddleware,
  adminMiddleware,
  scholarshipController.uploadDonationImageMiddleware,
  scholarshipController.addDonationOther
);
router.delete(
  "/add-donation-methods/:itemId",
  authMiddleware,
  adminMiddleware,
  scholarshipController.deleteDonationItem
);

module.exports = router;
