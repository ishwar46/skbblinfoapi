const express = require("express");
const router = express.Router();
const scholarshipRecipientsController = require("../controllers/scholarshipRecipientsController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to get the scholarship recipients page
router.get("/", scholarshipRecipientsController.getScholarshipRecipientsPage);

// Admin-only endpoint to update page-level info
router.put("/", authMiddleware, adminMiddleware, scholarshipRecipientsController.updateScholarshipRecipientsPage);

// Admin-only endpoint to add a recipient (with file upload)
router.post(
    "/items",
    authMiddleware,
    adminMiddleware,
    scholarshipRecipientsController.uploadRecipientImageMiddleware,
    scholarshipRecipientsController.addRecipientItem
);

// Admin-only endpoint to update a recipient
router.patch(
    "/items/:recipientId",
    authMiddleware,
    adminMiddleware,
    scholarshipRecipientsController.uploadRecipientImageMiddleware,
    scholarshipRecipientsController.updateRecipientItem
);

// Admin-only endpoint to delete a recipient
router.delete(
    "/items/:recipientId",
    authMiddleware,
    adminMiddleware,
    scholarshipRecipientsController.deleteRecipientItem
);

module.exports = router;
