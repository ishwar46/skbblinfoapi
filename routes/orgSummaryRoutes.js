const express = require("express");
const router = express.Router();
const orgSummaryController = require("../controllers/orgSummaryController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public GET
router.get("/", orgSummaryController.getOrgSummary);

// Admin routes
router.post(
  "/",
  //   authMiddleware,
  //   adminMiddleware,
  orgSummaryController.updateOrgSummaryPage
);

module.exports = router;
