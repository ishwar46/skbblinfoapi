const AboutUsPage = require("../models/AboutUs");
const createUploader = require("../middleware/uploader");

// Multer instance for aboutUs images
const aboutUsUploader = createUploader("aboutUs").fields([
  { name: "storyImage", maxCount: 1 },
  { name: "visionImage", maxCount: 1 },
  { name: "missionImage", maxCount: 1 },
]);
// Middleware wrapper for file uploads
exports.uploadAboutUsImageMiddleware = (req, res, next) => {
  aboutUsUploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/aboutUs
 * Public: Returns the AboutUsPage document (pageTitle, pageSubtitle,ourStory, ourVision, ourMission, storyImage, visionImage, missionImage)
 */
exports.getAboutUsPage = async (req, res) => {
  try {
    let page = await AboutUsPage.findOne();
    if (!page) {
      page = new AboutUsPage();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getAboutUsPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching aboutUs page." });
  }
};

/**
 * POST /api/about-us
 * Admin Only: Update page-level info (pageTitle, pageSubtitle,ourStory, ourVision, ourMission, storyImage, visionImage, missionImage).
 */
exports.updateAboutUsPage = async (req, res) => {
  try {
    const {
      pageTitle,
      pageSubtitle,
      ourStory,
      ourVision,
      ourMission,
      storyImage,
      visionImage,
      missionImage,
    } = req.body;
    let page = await AboutUsPage.findOne();
    if (!page) {
      page = new AboutUsPage();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    if (pageSubtitle !== undefined) page.pageSubtitle = pageSubtitle;
    if (ourStory !== undefined) page.ourStory = ourStory;
    if (ourVision !== undefined) page.ourVision = ourVision;
    if (ourMission !== undefined) page.ourMission = ourMission;
    if (storyImage !== undefined) page.storyImage = storyImage;
    if (visionImage !== undefined) page.visionImage = visionImage;
    if (missionImage !== undefined) page.missionImage = missionImage;

    if (req.files) {
      if (req.files.storyImage) {
        page.storyImage = req.files.storyImage[0].filename;
      }
      if (req.files.visionImage) {
        page.visionImage = req.files.visionImage[0].filename;
      }
      if (req.files.missionImage) {
        page.missionImage = req.files.missionImage[0].filename;
      }
    }
    await page.save();
    return res.status(200).json({
      message: "AboutUs page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateAboutUsItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating aboutUs page." });
  }
};
