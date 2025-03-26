const ProgressPage = require("../models/progressPage");
const createUploader = require("../middleware/uploader");
const sizeOf = require("image-size");
const path = require("path");

// Multer instance for "progressItems" images, storing under /uploads/progressItems
const progressUploader = createUploader("progress").single("centralImage");

exports.uploadProgressCentralImageMiddleware = (req, res, next) => {
  progressUploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};
const progressItemUploader = createUploader("progress").single("progressImage");

exports.uploadProgressItemMiddleware = (req, res, next) => {
  progressItemUploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/progressPage
 * Public: Returns the ProgressPage document (pageTitle, centralImage, progressItems:[{
 * title, value, dataType, image}])
 */
exports.getProgressPage = async (req, res) => {
  try {
    let page = await ProgressPage.findOne();
    if (!page) {
      page = new ProgressPage();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("Get Progress Page Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching progress page." });
  }
};

/**
 * POST /api/progressPage
 * Admin Only: Update page-level info (pageTitle, centralImage, progressItems:[{
 * title, value, dataType, image}])
 */
exports.updateProgressPage = async (req, res) => {
  try {
    const { pageTitle } = req.body;

    let page = await ProgressPage.findOne();

    if (!page) {
      page = new ProgressPage();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    if (req.file) {
      page.centralImage = req.file.filename;
    }

    await page.save();
    return res.status(200).json({
      message: "Progress Page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("Update Progress Page Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating impact summary item." });
  }
};
/**
 * POST /api/progressItems/items
 * Admin only: Add a new program item (title, value, etc.).
 * If there's an progressImage file, it's handled by Multer (uploadProgramImageMiddleware).
 */
exports.addProgressItem = async (req, res) => {
  try {
    const { title, value, dataType } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }
    console.log(req.file);
    let page = await ProgressPage.findOne();
    if (!page) {
      page = new ProgressPage();
      await page.save();
    }

    let imageName = "";
    if (req.file) {
      imageName = req.file.filename;
    }

    // Convert value from string if needed

    page.progressItems.push({
      title,
      value,
      dataType,
      progressImage: imageName,
    });

    await page.save();
    return res.status(201).json({
      message: "Program item added successfully.",
      page,
    });
  } catch (error) {
    console.error("addProgramItem Error:", error);
    return res.status(500).json({ error: "Server error adding program item." });
  }
};

/**
 * PATCH /api/progressItems/items/:itemId
 * Admin only: Update a specific program subdocument. Can also replace the progressImage with a new upload.
 */
exports.updateProgressItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { title, value, dataType } = req.body;

    let page = await ProgressPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Progress page not found." });
    }

    const progressItem = page.progressItems.id(itemId);
    if (!progressItem) {
      return res.status(404).json({ error: "Program item not found." });
    }

    if (title !== undefined) progressItem.title = title;
    if (dataType !== undefined) progressItem.dataType = dataType;

    // If value is provided (array or string)
    if (value !== undefined) {
      progressItem.value = Array.isArray(value) ? value : [value];
    }

    // If a new progressImage is uploaded
    if (req.file) {
      progressItem.progressImage = req.file.filename;
    }

    await page.save();
    return res.status(200).json({
      message: "Program item updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateProgramItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating program item." });
  }
};

/**
 * DELETE /api/progressItems/items/:itemId
 * Admin only: remove a program from the array by ID
 */
exports.deleteProgressItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    let page = await ProgressPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Progress page not found." });
    }

    const progressItem = page.progressItems.id(itemId);
    if (!progressItem) {
      return res.status(404).json({ error: "Progress item not found." });
    }

    page.progressItems.pull(itemId);

    await page.save();

    return res.status(200).json({
      message: "Progress item deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteProgramItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting progress item." });
  }
};
