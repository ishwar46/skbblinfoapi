const express = require("express");
const router = express.Router();
const dmvChapterController = require("../controllers/dmvChapterController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to retrieve DMV Chapter page
router.get("/", dmvChapterController.getDMVChapterPage);

// Admin-only endpoints
router.put("/", authMiddleware, adminMiddleware, dmvChapterController.updateDMVChapterPage);
router.post("/members", authMiddleware, adminMiddleware, dmvChapterController.addDMVMember);
router.patch("/members/:memberId", authMiddleware, adminMiddleware, dmvChapterController.updateDMVMember);
router.delete("/members/:memberId", authMiddleware, adminMiddleware, dmvChapterController.deleteDMVMember);

module.exports = router;
