const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publicationController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to get the Documents page details.
router.get("/", publicationController.getPublicationPage);

// Admin-only endpoint to update page-level info.
router.post(
  "/",
  // authMiddleware,
  // adminMiddleware,
  publicationController.updatePublicationCategories
);

// Admin-only endpoint to add a new document item (with file upload).
router.post(
  "/items",
  // authMiddleware,
  // adminMiddleware,
  publicationController.uploadPublicationDocumentMiddleware,
  publicationController.addPublicationItem
);

// Admin-only endpoint to update an existing document item.
router.patch(
  "/items/:itemId",
  // authMiddleware,
  // adminMiddleware,
  publicationController.uploadPublicationDocumentMiddleware,
  publicationController.updatePublicationItem
);

// Admin-only endpoint to delete a document item.
router.delete(
  "/items/:itemId",
  // authMiddleware,
  // adminMiddleware,
  publicationController.deletePublicationItem
);

module.exports = router;
