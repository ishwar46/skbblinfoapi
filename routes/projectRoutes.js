const express = require("express");
const router = express.Router();
const projectPageController = require("../controllers/projectPageController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public GET
router.get("/", projectPageController.getProjectPage);

// Admin-only to update page info
router.post(
  "/",
//   authMiddleware,
//   adminMiddleware,
  projectPageController.updateProjectPageInfo
);

// Admin-only to add a new image (with upload)
router.post(
  "/items",
//   authMiddleware,
//   adminMiddleware,
  projectPageController.uploadProjectImageMiddleware,
  projectPageController.addProjectToProjectPage
);

// Admin-only to update an existing image
router.patch(
  "/items/:itemId",
//   authMiddleware,
//   adminMiddleware,
  projectPageController.uploadProjectImageMiddleware,
  projectPageController.updateProjectPageImage
);

// Admin-only to delete an image
router.delete(
  "/items/:itemId",
//   authMiddleware,
//   adminMiddleware,
  projectPageController.deleteProjectPageImage
);

module.exports = router;
