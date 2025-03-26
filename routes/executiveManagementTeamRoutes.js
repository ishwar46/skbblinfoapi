const express = require("express");
const router = express.Router();
const executiveManagementTeamController = require("../controllers/executiveManagementTeamController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to retrieve the committee page
router.get("/", executiveManagementTeamController.getExecutiveManagementPage);

// Admin-only endpoints
router.patch(
  "/",
  // authMiddleware,
  // adminMiddleware,
  executiveManagementTeamController.updateExecutiveManagementPage
);
router.post(
  "/items",
  // authMiddleware,
  // adminMiddleware,
  executiveManagementTeamController.addManagementMember
);
router.patch(
  "/items/:memberId",
  // authMiddleware,
  // adminMiddleware,
  executiveManagementTeamController.updateManagementMember
);
router.delete(
  "/items/:memberId",
  // authMiddleware,
  // adminMiddleware,
  executiveManagementTeamController.deleteManagementMember
);

module.exports = router;
