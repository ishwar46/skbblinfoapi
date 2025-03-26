const CareerDocumentPage = require("../models/careerPage");
const createUploader = require("../middleware/uploader");

//stored under /uploads/career
const careerDocumentUploader =
  createUploader("career").single("careerDocument");

/**
 * Middleware to handle file upload for career.
 * Expects a form-data field named "careerDocument".
 */
exports.uploadCareerDocumentMiddleware = (req, res, next) => {
  careerDocumentUploader(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/career
 * Public endpoint: Retrieve the Career page details.
 */
exports.getCareerDocumentPage = async (req, res) => {
  try {
    let page = await CareerDocumentPage.findOne();
    if (!page) {
      page = new CareerDocumentPage();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getCareerDocumentPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching career page." });
  }
};

/**
 * PUT /api/career
 * Admin-only endpoint: Update the Career page info.
 * Expected JSON body: { pageTitle }
 */
exports.updateCareerDocumentPage = async (req, res) => {
  try {
    const { pageTitle } = req.body;
    let page = await CareerDocumentPage.findOne();
    if (!page) {
      page = new CareerDocumentPage();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    await page.save();
    return res.status(200).json({
      message: "Career page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateCareerDocumentPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating career page." });
  }
};

/**
 * POST /api/career/items
 * Admin-only endpoint: Add a new careerDocument item.
 * Expected form-data:
 * - Text fields: title
 * - File field: careerDocumentFile (the uploaded careerDocument, which can be an image or PDF)
 */
exports.addCareerDocumentItem = async (req, res) => {
  try {
    const { title, deadline } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }
    if (!deadline) {
      return res.status(400).json({ error: "Deadline is required." });
    }
    let page = await CareerDocumentPage.findOne();
    if (!page) {
      page = new CareerDocumentPage();
      await page.save();
    }
    let fileUrl = "";
    if (req.file) {
      fileUrl = req.file.filename;
    } else {
      return res
        .status(400)
        .json({ error: "CareerDocument file is required." });
    }
    page.documents.push({
      title,
      deadline,
      fileUrl,
    });
    await page.save();
    return res.status(201).json({
      message: "Career added successfully.",
      page,
    });
  } catch (error) {
    console.error("addCareerDocumentItem Error:", error);
    return res.status(500).json({ error: "Server error adding career item." });
  }
};

/**
 * PATCH /api/career/items/:docId
 * Admin-only endpoint: Update an existing careerDocument item.
 * Expected form-data: Text fields (title) and optionally a new file (careerDocumentFile)
 */
exports.updateCareerDocumentItem = async (req, res) => {
  try {
    const { docId } = req.params;
    const { title, deadline } = req.body;
    let page = await CareerDocumentPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Career page not found." });
    }
    const docItem = page.documents.id(docId);
    if (!docItem) {
      return res.status(404).json({ error: "Career item not found." });
    }
    if (title !== undefined) docItem.title = title;
    if (deadline !== undefined) docItem.deadline = deadline;
    if (req.file) {
      docItem.fileUrl = req.file.filename;
    }
    await page.save();
    return res.status(200).json({
      message: "Career item updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateCareerDocumentItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating career item." });
  }
};

/**
 * DELETE /api/career/items/:docId
 * Admin-only endpoint: Delete a careerDocument item.
 */
exports.deleteCareerDocumentItem = async (req, res) => {
  try {
    const { docId } = req.params;
    let page = await CareerDocumentPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Career page not found." });
    }
    const docItem = page.documents.id(docId);
    if (!docItem) {
      return res.status(404).json({ error: "Career item not found." });
    }
    page.documents.pull(docId);
    await page.save();
    return res.status(200).json({
      message: "Career item deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteCareerDocumentItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting careerDocument item." });
  }
};
