// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");

// For profile picture
router.post(
  "/profile-picture",
  authMiddleware,
  uploadController.uploadProfilePicture
);

// For a receipt file
router.post("/receipt", authMiddleware, uploadController.uploadReceipt);
router.post("/receipt-register", uploadController.uploadReceiptDuringRegister);

module.exports = router;
