const express = require("express");
const router = express.Router();
const executiveBodTeamController = require("../controllers/executiveBodTeamController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to retrieve the committee page
router.get("/", executiveBodTeamController.getExecutiveBodPage);

// Admin-only endpoints
router.patch(
  "/",
  // authMiddleware,
  // adminMiddleware,
  executiveBodTeamController.updateExecutiveBodPage
);
router.post(
  "/items",
  // authMiddleware,
  // adminMiddleware,
  executiveBodTeamController.addBodMember
);
router.patch(
  "/items/:memberId",
  // authMiddleware,
  // adminMiddleware,
  executiveBodTeamController.updateBodMember
);
router.delete(
  "/items/:memberId",
  // authMiddleware,
  // adminMiddleware,
  executiveBodTeamController.deleteBodMember
);

module.exports = router;
