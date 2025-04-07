const express = require("express");
const router = express.Router();
const aboutUsController = require("../controllers/aboutUsController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to get
router.get("/", aboutUsController.getAboutUsPage);

// Admin-only: update page-level info
router.patch(
  "/",
  authMiddleware,
  adminMiddleware,
  aboutUsController.uploadAboutUsImageMiddleware,
  aboutUsController.updateAboutUsPage
);

module.exports = router;
