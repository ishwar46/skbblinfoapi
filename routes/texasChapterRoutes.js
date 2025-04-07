const express = require("express");
const router = express.Router();
const texasChapterController = require("../controllers/texasChapterController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to retrieve the Texas Chapter Committee page.
router.get("/", texasChapterController.getTexasChapterPage);

// Admin-only endpoints:
router.put("/", authMiddleware, adminMiddleware, texasChapterController.updateTexasChapterPage);
router.post("/members", authMiddleware, adminMiddleware, texasChapterController.addTexasMember);
router.patch("/members/:memberId", authMiddleware, adminMiddleware, texasChapterController.updateTexasMember);
router.delete("/members/:memberId", authMiddleware, adminMiddleware, texasChapterController.deleteTexasMember);

module.exports = router;
