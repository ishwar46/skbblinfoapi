const SyllabusPage = require("../models/syllabusPage");
const createUploader = require("../middleware/uploader");

//stored under /uploads/syllabus
const syllabusUploader = createUploader("syllabus").single("syllabusFile");

/**
 * Middleware to handle file upload for syllabus.
 * Expects a form-data field named "syllabusFile".
 */
exports.uploadSyllabusMiddleware = (req, res, next) => {
  syllabusUploader(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/syllabus
 * Public endpoint: Retrieve the Syllabus page details.
 */
exports.getSyllabusPage = async (req, res) => {
  try {
    let page = await SyllabusPage.findOne();
    if (!page) {
      page = new SyllabusPage();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getSyllabusPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching syllabus page." });
  }
};

/**
 * PUT /api/syllabus
 * Admin-only endpoint: Update the Syllabus page info.
 * Expected JSON body: { pageTitle }
 */
exports.updateSyllabusPage = async (req, res) => {
  try {
    const { pageTitle } = req.body;
    let page = await SyllabusPage.findOne();
    if (!page) {
      page = new SyllabusPage();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;

    await page.save();
    return res.status(200).json({
      message: "Syllabus page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateSyllabusPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating syllabus page." });
  }
};

/**
 * POST /api/syllabus/items
 * Admin-only endpoint: Add a new syllabus
 * Expected form-data:
 * - Text fields: category
 * - File field: syllabusFile (the uploaded syllabus, which can be an image or PDF)
 */
exports.addSyllabusItem = async (req, res) => {
  try {
    const { category, designation, jobType } = req.body;
    console.log(req.file);
    if (!category) {
      return res.status(400).json({ error: "Category is required." });
    }
    if (!designation) {
      return res.status(400).json({ error: "Designation is required." });
    }

    if (!jobType) {
      return res.status(400).json({ error: "JobType is required." });
    }

    if (jobType !== "Internal" && jobType !== "Open") {
      return res.status(400).json({ error: "Invalid Job Type(Internal/Open)" });
    }
    let page = await SyllabusPage.findOne();
    if (!page) {
      page = new SyllabusPage();
      await page.save();
    }
    let fileUrl = "";
    if (req.file) {
      fileUrl = req.file.filename;
    } else {
      return res.status(400).json({ error: "Syllabus file is required." });
    }
    page.documents.push({
      category,
      designation,
      jobType,
      fileUrl,
    });
    await page.save();
    return res.status(201).json({
      message: "Syllabus added successfully.",
      page,
    });
  } catch (error) {
    console.error("addSyllabusItem Error:", error);
    return res.status(500).json({ error: "Server error adding syllabus" });
  }
};

/**
 * PATCH /api/syllabus/items/:docId
 * Admin-only endpoint: Update an existing syllabus
 * Expected form-data: Text fields (category) and optionally a new file (syllabusFile)
 */
exports.updateSyllabusItem = async (req, res) => {
  try {
    const { docId } = req.params;
    const { category, designation, jobType } = req.body;
    let page = await SyllabusPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Syllabus page not found." });
    }
    const docItem = page.documents.id(docId);
    if (!docItem) {
      return res.status(404).json({ error: "Syllabus item not found." });
    }
    if (category !== undefined) docItem.category = category;
    if (designation !== undefined) docItem.designation = designation;
    if (jobType !== undefined) docItem.jobType = jobType;
    if (req.file) {
      docItem.fileUrl = req.file.filename;
    }
    await page.save();
    return res.status(200).json({
      message: "Syllabus item updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateSyllabusItem Error:", error);
    return res.status(500).json({ error: "Server error updating syllabus" });
  }
};

/**
 * DELETE /api/syllabus/items/:docId
 * Admin-only endpoint: Delete a syllabus
 */
exports.deleteSyllabusItem = async (req, res) => {
  try {
    const { docId } = req.params;
    let page = await SyllabusPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Syllabus page not found." });
    }
    const docItem = page.documents.id(docId);
    if (!docItem) {
      return res.status(404).json({ error: "Syllabus item not found." });
    }
    page.documents.pull(docId);
    await page.save();
    return res.status(200).json({
      message: "Syllabus item deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteSyllabusItem Error:", error);
    return res.status(500).json({ error: "Server error deleting syllabus" });
  }
};
