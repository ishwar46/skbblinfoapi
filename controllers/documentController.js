const DocumentPage = require("../models/reportPage");
const createUploader = require("../middleware/uploader");

//stored under /uploads/documents
const documentUploader = createUploader("documents").single("documentFile");

/**
 * Middleware to handle file upload for documents.
 * Expects a form-data field named "documentFile".
 */
exports.uploadDocumentMiddleware = (req, res, next) => {
  documentUploader(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/documents
 * Public endpoint: Retrieve the Documents page details.
 */
exports.getDocumentPage = async (req, res) => {
  try {
    let page = await DocumentPage.findOne();
    if (!page) {
      page = new DocumentPage();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getDocumentPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching documents page." });
  }
};

/**
 * PUT /api/documents
 * Admin-only endpoint: Update the Documents page info.
 * Expected JSON body: { pageTitle, pageDescription }
 */
exports.updateDocumentPage = async (req, res) => {
  try {
    const { pageTitle, pageDescription } = req.body;
    let page = await DocumentPage.findOne();
    if (!page) {
      page = new DocumentPage();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    if (pageDescription !== undefined) page.pageDescription = pageDescription;
    await page.save();
    return res.status(200).json({
      message: "Documents page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateDocumentPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating documents page." });
  }
};

/**
 * POST /api/documents/items
 * Admin-only endpoint: Add a new document item.
 * Expected form-data:
 * - Text fields: title
 * - File field: documentFile (the uploaded document, which can be an image or PDF)
 */
exports.addDocumentItem = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }
    let page = await DocumentPage.findOne();
    if (!page) {
      page = new DocumentPage();
      await page.save();
    }
    let fileUrl = "";
    let fileType = "";
    if (req.file) {
      fileUrl = req.file.filename;
      // Determine file type based on mimetype
      if (req.file.mimetype === "application/pdf") {
        fileType = "pdf";
      } else if (req.file.mimetype.startsWith("image/")) {
        fileType = "image";
      }
    } else {
      return res.status(400).json({ error: "Document file is required." });
    }
    page.documents.push({
      title,
      fileUrl,
      fileType,
    });
    await page.save();
    return res.status(201).json({
      message: "Document added successfully.",
      page,
    });
  } catch (error) {
    console.error("addDocumentItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error adding document item." });
  }
};

/**
 * PATCH /api/documents/items/:docId
 * Admin-only endpoint: Update an existing document item.
 * Expected form-data: Text fields (title) and optionally a new file (documentFile)
 */
exports.updateDocumentItem = async (req, res) => {
  try {
    const { docId } = req.params;
    const { title } = req.body;
    let page = await DocumentPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Documents page not found." });
    }
    const docItem = page.documents.id(docId);
    if (!docItem) {
      return res.status(404).json({ error: "Document item not found." });
    }
    if (title !== undefined) docItem.title = title;
    if (req.file) {
      docItem.fileUrl = req.file.filename;
      if (req.file.mimetype === "application/pdf") {
        docItem.fileType = "pdf";
      } else if (req.file.mimetype.startsWith("image/")) {
        docItem.fileType = "image";
      }
    }
    await page.save();
    return res.status(200).json({
      message: "Document item updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateDocumentItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating document item." });
  }
};

/**
 * DELETE /api/documents/items/:docId
 * Admin-only endpoint: Delete a document item.
 */
exports.deleteDocumentItem = async (req, res) => {
  try {
    const { docId } = req.params;
    let page = await DocumentPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Documents page not found." });
    }
    const docItem = page.documents.id(docId);
    if (!docItem) {
      return res.status(404).json({ error: "Document item not found." });
    }
    page.documents.pull(docId);
    await page.save();
    return res.status(200).json({
      message: "Document item deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteDocumentItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting document item." });
  }
};
