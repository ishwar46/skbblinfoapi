const ReportPage = require("../models/reportPage");
const createUploader = require("../middleware/uploader");

//stored under /uploads/reports
const reportUploader = createUploader("reports").single("reportFile");

/**
 * Middleware to handle file upload for reports.
 * Expects a form-data field named "documentFile".
 */
exports.uploadReportMiddleware = (req, res, next) => {
  reportUploader(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/reports
 * Public endpoint: Retrieve the Reports page details.
 */
exports.getReportPage = async (req, res) => {
  try {
    let page = await ReportPage.findOne();
    if (!page) {
      page = new ReportPage();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getReportPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching reports page." });
  }
};

/**
 * PUT /api/reports
 * Admin-only endpoint: Update the Report page info.
 * Expected JSON body: { categories }
 */
exports.updateReportCategories = async (req, res) => {
  try {
    const { categories } = req.body;
    let page = await ReportPage.findOne();
    if (!page) {
      page = new ReportPage();
    }
    if (categories !== undefined) page.categories = categories;
    await page.save();
    return res.status(200).json({
      message: "Report categories updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateReportCategories Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating publication page." });
  }
};

exports.addReportItem = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }
    if (!category) {
      return res.status(400).json({ error: "Category is required." });
    }

    let page = await ReportPage.findOne();
    const categorySet = new Set(page.categories);
    if (!categorySet.has(category)) {
      return res
        .status(400)
        .json({ error: `Invalid Category ${page.categories}` });
    }
    if (!page) {
      page = new ReportPage();
      await page.save();
    }
    let fileUrl = "";
    if (req.file) {
      fileUrl = req.file.filename;
    } else {
      return res.status(400).json({ error: "Report file is required." });
    }
    page.documents.push({
      title,
      category,
      fileUrl,
    });
    await page.save();
    return res.status(201).json({
      message: "Report added successfully.",
      page,
    });
  } catch (error) {
    console.error("addReportItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error adding document item." });
  }
};

exports.updateReportItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { title, category } = req.body;
    let page = await ReportPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Report page not found." });
    }
    const categorySet = new Set(page.categories);
    if (!categorySet.has(category)) {
      return res.status(400).json({ error: "Invalid Category" });
    }
    const docItem = page.documents.id(itemId);
    if (!docItem) {
      return res.status(404).json({ error: "Report item not found." });
    }
    if (title !== undefined) docItem.title = title;
    if (category !== undefined) docItem.category = category;
    if (req.file) {
      docItem.fileUrl = req.file.filename;
    }
    await page.save();
    return res.status(200).json({
      message: "Report item updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateReportItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating document item." });
  }
};

exports.deleteReportItem = async (req, res) => {
  try {
    const { docId } = req.params;
    let page = await ReportPage.findOne();
    if (!page || !page.reports.has(docId)) {
      return res.status(404).json({ error: "Report item not found." });
    }
    page.reports.delete(docId);
    await page.save();
    return res.status(200).json({
      message: "Report item deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteReportItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting document item." });
  }
};
