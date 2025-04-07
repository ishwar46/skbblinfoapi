const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to get the Documents page details.
router.get("/", documentController.getDocumentPage);

// Admin-only endpoint to update page-level info.
router.put(
  "/",
  authMiddleware,
  adminMiddleware,
  documentController.updateDocumentPage
);

// Admin-only endpoint to add a new document item (with file upload).
router.post(
  "/items",
  authMiddleware,
  adminMiddleware,
  documentController.uploadDocumentMiddleware,
  documentController.addDocumentItem
);

// Admin-only endpoint to update an existing document item.
router.patch(
  "/items/:docId",
  authMiddleware,
  adminMiddleware,
  documentController.uploadDocumentMiddleware,
  documentController.updateDocumentItem
);

// Admin-only endpoint to delete a document item.
router.delete(
  "/items/:docId",
  authMiddleware,
  adminMiddleware,
  documentController.deleteDocumentItem
);

module.exports = router;
