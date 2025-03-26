const ReportPage = require("../models/reportPage");
const createUploader = require("../middleware/uploader");

const allowedFileTypes = [
  "Annual Report",
  "Right to Information",
  "Quarterly Report",
  "AGM Minute Report",
];

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

exports.addReportItem = async (req, res) => {
  try {
    const { title, fileType } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Report file is required." });
    }
    if (!allowedFileTypes.includes(fileType)) {
      return res.status(400).json({ error: "File type not allowed." });
    }

    let fileUrl = req.file.filename;

    let page = await ReportPage.findOne();
    if (!page) {
      page = new ReportPage({ reports: new Map() }); // Initialize reports as an empty Map
    }

    if (!page.reports) {
      page.reports = new Map(); // Ensure reports is initialized
    }

    page.reports.set(fileType, {
      title,
      reportFile: fileUrl,
      uploadedAt: new Date(),
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
    const { docId } = req.params;
    const { title } = req.body;
    let page = await ReportPage.findOne();
    if (!page || !page.reports.has(docId)) {
      return res.status(404).json({ error: "Report item not found." });
    }
    const docItem = page.reports.get(docId);
    if (title) docItem.title = title;
    if (req.file) {
      docItem.reportFile = req.file.filename;
    }
    page.reports.set(docId, docItem);
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
