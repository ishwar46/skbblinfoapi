const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyPageController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to get the story page
router.get("/", storyController.getStoryPage);

// Admin-only
router.post("/", authMiddleware, adminMiddleware, storyController.createStoryPage);
router.put("/", authMiddleware, adminMiddleware, storyController.updateStoryPage);
router.post(
    "/items",
    authMiddleware,
    adminMiddleware,
    storyController.uploadStoryImageMiddleware,
    storyController.addStoryItem
);
router.patch(
    "/items/:storyId",
    authMiddleware,
    adminMiddleware,
    storyController.uploadStoryImageMiddleware,
    storyController.updateStoryItem
);
router.delete("/items/:storyId", authMiddleware, adminMiddleware, storyController.deleteStoryItem);

// Delete entire StoryPage
router.delete("/", authMiddleware, adminMiddleware, storyController.deleteStoryPage);

module.exports = router;
