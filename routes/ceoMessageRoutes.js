const express = require("express");
const router = express.Router();
const ceoMessageController = require("../controllers/ceoMessageController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to get
router.get("/", ceoMessageController.getPresidentMessage);

// Admin-only: update page-level info
router.patch(
  "/",
  // authMiddleware,
  // adminMiddleware,
  ceoMessageController.uploadCeoImageMiddleware,
  ceoMessageController.updatePresidentMessage
);

module.exports = router;
