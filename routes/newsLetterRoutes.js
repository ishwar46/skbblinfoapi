const express = require("express");
const router = express.Router();
const newsLetterController = require("../controllers/newsLetterController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public endpoint to get
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  newsLetterController.getNewsletter
);
router.patch("/", newsLetterController.addNewEmail);

module.exports = router;
