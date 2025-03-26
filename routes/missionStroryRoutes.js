const express = require("express");
const router = express.Router();
const missionStoryController = require("../controllers/missionStoryController");
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require('../middleware/authMiddleware');


// Public
router.get("/", missionStoryController.getMissionStory);

// Admin only
router.post("/", authMiddleware, adminMiddleware, missionStoryController.createMissionStory);
router.put("/", authMiddleware, adminMiddleware, missionStoryController.updateMissionStory);
router.post("/videos", authMiddleware, adminMiddleware, missionStoryController.addYoutubeVideo);
router.delete("/videos/:videoId", authMiddleware, adminMiddleware, missionStoryController.deleteYoutubeVideo);

module.exports = router;
