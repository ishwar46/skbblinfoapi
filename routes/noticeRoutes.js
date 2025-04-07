const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/noticeController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", noticeController.getNotices);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  noticeController.uploadNoticeMiddleWare,
  noticeController.addNoticeItem
);
router.delete(
  "/:fileId",
  authMiddleware,
  adminMiddleware,
  noticeController.deleteNoticeFile
);

module.exports = router;
