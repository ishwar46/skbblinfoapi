const express = require("express");
const router = express.Router();
const aboutController = require("../controllers/aboutController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to get
router.get("/", aboutController.getAboutPage);

// Admin-only: update page-level info
router.patch(
  "/",
  // authMiddleware,
  // adminMiddleware,
  aboutController.uploadAboutImageMiddleware,
  aboutController.updateAboutPage
);

module.exports = router;
