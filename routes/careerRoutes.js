const express = require("express");
const router = express.Router();
const careerController = require("../controllers/careerController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to get the Documents page details.
router.get("/", careerController.getCareerDocumentPage);

// Admin-only endpoint to update page-level info.
router.put(
  "/",
  // authMiddleware,
  // adminMiddleware,
  careerController.updateCareerDocumentPage
);

// Admin-only endpoint to add a new document item (with file upload).
router.post(
  "/items",
  // authMiddleware,
  // adminMiddleware,
  careerController.uploadCareerDocumentMiddleware,
  careerController.addCareerDocumentItem
);

// Admin-only endpoint to update an existing document item.
router.patch(
  "/items/:docId",
  // authMiddleware,
  // adminMiddleware,
  careerController.uploadCareerDocumentMiddleware,
  careerController.updateCareerDocumentItem
);

// Admin-only endpoint to delete a document item.
router.delete(
  "/items/:docId",
  // authMiddleware,
  // adminMiddleware,
  careerController.deleteCareerDocumentItem
);

module.exports = router;
