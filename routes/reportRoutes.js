const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to get the Documents page details.
router.get("/", reportController.getReportPage);

// Admin-only endpoint to add a new document item (with file upload).
router.post(
  "/items",
  // authMiddleware,
  // adminMiddleware,
  reportController.uploadReportMiddleware,
  reportController.addReportItem
);

// Admin-only endpoint to update an existing document item.
router.patch(
  "/items/:docId",
  // authMiddleware,
  // adminMiddleware,
  reportController.uploadReportMiddleware,
  reportController.updateReportItem
);

// Admin-only endpoint to delete a document item.
router.delete(
  "/items/:docId",
  // authMiddleware,
  // adminMiddleware,
  reportController.deleteReportItem
);

module.exports = router;
