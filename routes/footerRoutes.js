const express = require("express");
const router = express.Router();
const footerController = require("../controllers/footerController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public GET
router.get("/", footerController.getFooter);
router.patch(
  "/",
  authMiddleware,
  adminMiddleware,
  footerController.updateFooter
);
router.post(
  "/items",
  authMiddleware,
  adminMiddleware,
  footerController.addToList
);
router.delete(
  "/items",
  authMiddleware,
  adminMiddleware,
  footerController.deleteFromList
);

module.exports = router;
