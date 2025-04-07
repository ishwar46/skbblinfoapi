const express = require("express");
const router = express.Router();
const settingController = require("../controllers/settingsController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public GET
router.get("/", settingController.getSettings);
router.patch(
  "/",
  authMiddleware,
  adminMiddleware,
  settingController.updateSettings
);

module.exports = router;
