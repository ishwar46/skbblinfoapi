const createUploader = require("../middleware/uploader");
const Notice = require("../models/Notice");
const path = require("path");
const noticeUploader = createUploader("notices").single("noticeFile");

exports.uploadNoticeMiddleWare = (req, res, next) => {
  noticeUploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};
/**
 * GET /api/notices
 * Public - Fetch the notices
 */
exports.getNotices = async (req, res) => {
  try {
    let page = await Notice.findOne();
    if (!page) {
      page = new Notice({});
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getNotice Error:", error);
    return res.status(500).json({ error: "Server error fetching notice." });
  }
};

/**
 * POST /api/notices
 * Admin only - Add a new notice
 */
exports.addNoticeItem = async (req, res) => {
  try {
    let page = await Notice.findOne();
    if (!page) {
      page = new Notice();
      await page.save();
    }

    let newNotice = {};

    if (req.file) {
      newNotice.fileName = req.file.filename;
    }

    // push newImage object to page.images
    page.notices.push(newNotice);

    await page.save();
    return res.status(201).json({
      message: "Notice added to page.",
      page,
    });
  } catch (error) {
    console.error("addImageToNotice Error:", error);
    return res.status(500).json({ error: "Server error adding notice." });
  }
};
/**
 * POST /api/notices/:id
 * Admin only - Delete existing new notice
 */
exports.deleteNoticeFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    let notice = await Notice.findOne();
    if (!notice) {
      return res.status(404).json({ error: "No notice found." });
    }

    const fileItem = notice.notices.id(fileId);
    if (!fileItem) {
      return res.status(404).json({ error: "File not found in notice." });
    }

    // Remove the subdocument
    notice.notices.pull(fileId);

    await notice.save();
    return res.status(200).json({
      message: "Notice file removed.",
      notice,
    });
  } catch (error) {
    console.error("deleteNoticeImage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting notice file." });
  }
};
