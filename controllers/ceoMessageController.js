const CeoMessage = require("../models/ceoMessage");
const createUploader = require("../middleware/uploader");
const sizeOf = require("image-size");
const path = require("path");

// Multer instance for "ceo" images, storing under /uploads/ceoImage
const ceoUploader = createUploader("ceo").single("ceoImage");

exports.uploadCeoImageMiddleware = (req, res, next) => {
  ceoUploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/ceo-message
 * Public: Returns the CeoMessage document (pageTitle, paragraph, ceoTitle, highlightedText)
 */
exports.getCeoMessage = async (req, res) => {
  try {
    let page = await CeoMessage.findOne();
    if (!page) {
      page = new CeoMessage();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("Get CEO Message Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching ceo message page." });
  }
};

/**
 * POST /api/ceo-message
 * Admin Only: Update page-level info (pageTitle, paragraph, ceoTitle, highlightedText)
 */
exports.updateCeoMessage = async (req, res) => {
  try {
    const { pageTitle, paragraph, ceoTitle, highlightedText } = req.body;
    let page = await CeoMessage.findOne();

    if (!page) {
      page = new CeoMessage();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    if (paragraph !== undefined) page.paragraph = paragraph;
    if (ceoTitle !== undefined) page.ceoTitle = ceoTitle;
    if (highlightedText !== undefined) page.highlightedText = highlightedText;
    if (req.file) {
      page.ceoImage = req.file.filename;
    }
    await page.save();
    return res.status(200).json({
      message: "President Message updated successfully.",
      page,
    });
  } catch (error) {
    console.error("Update CEO Message Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating ceo message item." });
  }
};
