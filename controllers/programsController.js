const ProgramsPage = require("../models/programsPage");
const createUploader = require("../middleware/uploader");
const sizeOf = require("image-size");
const path = require("path");

// Multer instance for "programs" images, storing under /uploads/programs
const programUploader = createUploader("programs").single("programImage");

exports.uploadProgramImageMiddleware = (req, res, next) => {
  programUploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/programs
 * Public: returns the single programs page doc with pageTitle, pageSubtitle, programs array
 */
exports.getProgramsPage = async (req, res) => {
  try {
    let page = await ProgramsPage.findOne();
    if (!page) {
      // If not found, create a default doc
      page = new ProgramsPage();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getProgramsPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching programs page." });
  }
};

/**
 * POST /api/programs
 * Admin only: update the page-level info (pageTitle, pageSubtitle, etc.)
 */
exports.updateProgramsPage = async (req, res) => {
  try {
    const { pageTitle, pageSubtitle } = req.body;
    let page = await ProgramsPage.findOne();
    if (!page) {
      page = new ProgramsPage();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    if (pageSubtitle !== undefined) page.pageSubtitle = pageSubtitle;

    await page.save();
    return res.status(200).json({
      message: "Programs page info updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateProgramsPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating programs page." });
  }
};

/**
 * POST /api/programs/items
 * Admin only: Add a new program item (title, bullets, etc.).
 * If there's an programImage file, it's handled by Multer (uploadProgramImageMiddleware).
 */
exports.addProgramItem = async (req, res) => {
  try {
    const { title, bullets, fullDescription, order } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    let page = await ProgramsPage.findOne();
    if (!page) {
      page = new ProgramsPage();
      await page.save();
    }

    let imagePath = "";
    let imageName = "";
    if (req.file) {
      imagePath = req.file.path;
      imageName = req.file.filename;
      const dimensions = sizeOf(req.file.path);
    }

    // Convert bullets from string if needed
    let bulletArray = [];
    if (bullets) {
      bulletArray = Array.isArray(bullets) ? bullets : [bullets];
    }

    page.programs.push({
      title,
      programImage: imageName,
      bullets: bulletArray,
      fullDescription: fullDescription || "",
      order: order || 0,
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
 * PATCH /api/programs/items/:programId
 * Admin only: Update a specific program subdocument. Can also replace the programImage with a new upload.
 */
exports.updateProgramItem = async (req, res) => {
  try {
    const { programId } = req.params;
    const { title, bullets, fullDescription, order } = req.body;

    let page = await ProgramsPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Programs page not found." });
    }

    const programItem = page.programs.id(programId);
    if (!programItem) {
      return res.status(404).json({ error: "Program item not found." });
    }

    if (title !== undefined) programItem.title = title;
    if (fullDescription !== undefined)
      programItem.fullDescription = fullDescription;
    if (order !== undefined) programItem.order = order;

    // If bullets is provided (array or string)
    if (bullets !== undefined) {
      programItem.bullets = Array.isArray(bullets) ? bullets : [bullets];
    }

    // If a new programImage is uploaded
    if (req.file) {
      programItem.programImage = path.basename(req.file.path);
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
 * DELETE /api/programs/items/:programId
 * Admin only: remove a program from the array by ID
 */
exports.deleteProgramItem = async (req, res) => {
  try {
    const { programId } = req.params;
    let page = await ProgramsPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Programs page not found." });
    }

    const programItem = page.programs.id(programId);
    if (!programItem) {
      return res.status(404).json({ error: "Program item not found." });
    }

    page.programs.pull(programId);

    await page.save();

    return res.status(200).json({
      message: "Program item deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteProgramItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting program item." });
  }
};

exports.getProgramItem = async (req, res) => {
  try {
    const { programId } = req.params;
    const page = await ProgramsPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Programs page not found." });
    }
    const programItem = page.programs.id(programId);
    if (!programItem) {
      return res.status(404).json({ error: "Program item not found." });
    }
    return res.status(200).json(programItem);
  } catch (error) {
    console.error("Error fetching program item:", error);
    return res.status(500).json({ error: "Server error fetching program item." });
  }
};

