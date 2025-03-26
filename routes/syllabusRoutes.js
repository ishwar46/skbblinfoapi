const express = require("express");
const router = express.Router();
const syllabusController = require("../controllers/syllabusController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to get the Documents page details.
router.get("/", syllabusController.getSyllabusPage);

// Admin-only endpoint to update page-level info.
router.put(
  "/",
  // authMiddleware,
  // adminMiddleware,
  syllabusController.updateSyllabusPage
);

// Admin-only endpoint to add a new document item (with file upload).
router.post(
  "/items",
  // authMiddleware,
  // adminMiddleware,
  syllabusController.uploadSyllabusMiddleware,
  syllabusController.addSyllabusItem
);

// Admin-only endpoint to update an existing document item.
router.patch(
  "/items/:docId",
  // authMiddleware,
  // adminMiddleware,
  syllabusController.uploadSyllabusMiddleware,
  syllabusController.updateSyllabusItem
);

// Admin-only endpoint to delete a document item.
router.delete(
  "/items/:docId",
  // authMiddleware,
  // adminMiddleware,
  syllabusController.deleteSyllabusItem
);

module.exports = router;
