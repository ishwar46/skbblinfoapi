const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to get
router.get("/", progressController.getProgressPage);

// Admin-only: update page-level info
router.post(
  "/",
  // authMiddleware,
  // adminMiddleware,
  progressController.uploadProgressCentralImageMiddleware,
  progressController.updateProgressPage
);

// Admin-only: add a new item
router.post(
  "/items",
  // authMiddleware,
  // adminMiddleware,
  progressController.uploadProgressItemMiddleware,
  progressController.addProgressItem
);

// Admin-only: update an existing item
router.patch(
  "/items/:itemId",
  // authMiddleware,
  // adminMiddleware,
  progressController.uploadProgressItemMiddleware,
  progressController.updateProgressItem
);

// Admin-only: delete an existing item
router.delete(
  "/items/:itemId",
  // authMiddleware,
  // adminMiddleware,
  progressController.deleteProgressItem
);

module.exports = router;
