const InterestRates = require("../models/InterestRates");
const createUploader = require("../middleware/uploader");

// Multer instance for interest images
const interestUploader = createUploader("interest").fields([
  { name: "interestImage", maxCount: 1 },
]);
// Middleware wrapper for file uploads
exports.uploadInterestImageMiddleware = (req, res, next) => {
  interestUploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/interest
 * Public: Returns the InterestRates document (pageTitle, interestImage)
 */
exports.getInterestRates = async (req, res) => {
  try {
    let page = await InterestRates.findOne();
    if (!page) {
      page = new InterestRates();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getInterestRates Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching interest page." });
  }
};

/**
 * POST /api/interest
 * Admin Only: Update page-level info (pageTitle, pageSubtitle,ourStory, ourVision, ourMission, storyImage, visionImage, interestImage).
 */
exports.updateInterestRates = async (req, res) => {
  try {
    const { pageTitle, interestImage } = req.body;
    let page = await InterestRates.findOne();
    if (!page) {
      page = new InterestRates();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    if (interestImage !== undefined) page.interestImage = interestImage;

    if (req.files) {
      if (req.files.interestImage) {
        page.interestImage = req.files.interestImage[0].filename;
      }
    }
    await page.save();
    return res.status(200).json({
      message: "Interest page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateInterestItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating interest page." });
  }
};
