const express = require("express");
const router = express.Router();
const branchController = require("../controllers/branchController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to get
router.get("/", branchController.getBranches);

// Admin-only: update page-level info (page title and subtitle)
router.post(
  "/",
  //   authMiddleware,
  //   adminMiddleware,
  branchController.updateBranchPage
);

// Admin-only: add a new blog item (with image upload)
router.post(
  "/items",
  //   authMiddleware,
  //   adminMiddleware,
  branchController.addBranch
);

// Admin-only: update an existing blog item (optionally with image upload)
router.patch(
  "/items/:itemId",
  //   authMiddleware,
  //   adminMiddleware,
  branchController.updateBranch
);

// Admin-only: delete a blog item
router.delete(
  "/items/:itemId",
  //   authMiddleware,
  //   adminMiddleware,
  branchController.deleteBranch
);

module.exports = router;
