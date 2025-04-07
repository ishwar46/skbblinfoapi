const express = require("express");
const router = express.Router();
const imageSliderController = require("../controllers/imageSlideController");

// Middlewares
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public route to get slides
router.get("/", imageSliderController.getAllSlides);

// Admin routes
//Create Slides
router.post(
  "/",
  // authMiddleware,
  // adminMiddleware,
  imageSliderController.uploadSlideImageMiddleware,
  imageSliderController.createSlide
);
// Delete Slides
router.delete(
  "/:itemId",
  // authMiddleware,
  // adminMiddleware,
  imageSliderController.deleteSlide
);

module.exports = router;
