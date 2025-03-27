const AboutPage = require("../models/About");
const createUploader = require("../middleware/uploader");

// Multer instance for about images
const aboutUploader = createUploader("about").fields([
  { name: "centralImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);
// Middleware wrapper for file uploads
exports.uploadAboutImageMiddleware = (req, res, next) => {
  aboutUploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/about
 * Public: Returns the AboutPage document (pageTitle, pageDescription, ourValues, ourVision, ourMission, centralImage, bannerImage)
 */
exports.getAboutPage = async (req, res) => {
  try {
    let page = await AboutPage.findOne();
    if (!page) {
      page = new AboutPage();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getAboutPage Error:", error);
    return res.status(500).json({ error: "Server error fetching about page." });
  }
};

/**
 * POST /api/about
 * Admin Only: Update page-level info (pageTitle, pageDescription, ourValues, ourVision, ourMission, centralImage, bannerImage).
 */
exports.updateAboutPage = async (req, res) => {
  try {
    const {
      pageTitle,
      pageDescription,
      centralImage,
      bannerImage,
      ourVision,
      ourMission,
      ourValues,
      ourObjectives,
    } = req.body;
    let page = await AboutPage.findOne();
    if (!page) {
      page = new AboutPage();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    if (pageDescription !== undefined) page.pageDescription = pageDescription;
    if (ourValues !== undefined) page.ourValues = ourValues;
    if (ourVision !== undefined) page.ourVision = ourVision;
    if (ourMission !== undefined) page.ourMission = ourMission;
    if (centralImage !== undefined) page.centralImage = centralImage;
    if (bannerImage !== undefined) page.bannerImage = bannerImage;
    if (ourObjectives !== undefined) page.ourObjectives = ourObjectives;

    if (req.files) {
      if (req.files.centralImage) {
        page.centralImage = req.files.centralImage[0].filename;
      }
      if (req.files.bannerImage) {
        page.bannerImage = req.files.bannerImage[0].filename;
      }
    }
    await page.save();
    return res.status(200).json({
      message: "About page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateAboutItem Error:", error);
    return res.status(500).json({ error: "Server error updating about page." });
  }
};
