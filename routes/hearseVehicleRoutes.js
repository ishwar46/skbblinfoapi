const express = require("express");
const router = express.Router();
const hearseController = require("../controllers/hearseVehicleController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public: Get Hearse Vehicle Contributions page data
router.get("/", hearseController.getHearseVehiclePage);

// Admin-only: Update page-level info
router.put("/", authMiddleware, adminMiddleware, hearseController.updateHearseVehiclePage);

// Admin-only: Add a new contribution
router.post("/items", authMiddleware, adminMiddleware, hearseController.addContribution);

// Admin-only: Update a contribution
router.patch("/items/:contributionId", authMiddleware, adminMiddleware, hearseController.updateContribution);

// Admin-only: Delete a contribution
router.delete("/items/:contributionId", authMiddleware, adminMiddleware, hearseController.deleteContribution);

module.exports = router;
