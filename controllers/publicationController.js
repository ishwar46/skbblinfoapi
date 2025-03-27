const PublicationPage = require("../models/publicationPage");
const createUploader = require("../middleware/uploader");

//stored under /uploads/publication
const publicationDocumentUploader = createUploader("publication").single(
  "publicationDocument"
);

/**
 * Middleware to handle file upload for publication.
 * Expects a form-data field named "publicationDocument".
 */
exports.uploadPublicationDocumentMiddleware = (req, res, next) => {
  publicationDocumentUploader(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/publication
 * Public endpoint: Retrieve the Publication page details.
 */
exports.getPublicationPage = async (req, res) => {
  try {
    let page = await PublicationPage.findOne();
    if (!page) {
      page = new PublicationPage();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getPublicationPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching publication page." });
  }
};

/**
 * PUT /api/publication
 * Admin-only endpoint: Update the Publication page info.
 * Expected JSON body: { pageTitle }
 */
exports.updatePublicationCategories = async (req, res) => {
  try {
    const { categories } = req.body;
    let page = await PublicationPage.findOne();
    if (!page) {
      page = new PublicationPage();
    }
    if (categories !== undefined) page.categories = categories;
    await page.save();
    return res.status(200).json({
      message: "Publication categories updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updatePublicationCategories Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating publication page." });
  }
};

/**
 * POST /api/publication/items
 * Admin-only endpoint: Add a new publicationDocument item.
 * Expected form-data:
 * - Text fields: title
 * - File field: publicationDocumentFile (the uploaded publicationDocument, which can be an image or PDF)
 */
exports.addPublicationItem = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }
    if (!category) {
      return res.status(400).json({ error: "Category is required." });
    }

    let page = await PublicationPage.findOne();
    const categorySet = new Set(page.categories);
    if (!categorySet.has(category)) {
      return res
        .status(400)
        .json({ error: `Invalid Category ${page.categories}` });
    }
    if (!page) {
      page = new PublicationPage();
      await page.save();
    }
    let fileUrl = "";
    if (req.file) {
      fileUrl = req.file.filename;
    } else {
      return res.status(400).json({ error: "Publication file is required." });
    }
    page.documents.push({
      title,
      category,
      fileUrl,
    });
    await page.save();
    return res.status(201).json({
      message: "Publication added successfully.",
      page,
    });
  } catch (error) {
    console.error("addPublicationItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error adding publication item." });
  }
};

/**
 * PATCH /api/publication/items/:itemId
 * Admin-only endpoint: Update an existing publicationDocument item.
 * Expected form-data: Text fields (title) and optionally a new file (publicationDocumentFile)
 */
exports.updatePublicationItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { title, category } = req.body;
    let page = await PublicationPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Publication page not found." });
    }
    const categorySet = new Set(page.categories);
    if (!categorySet.has(category)) {
      return res.status(400).json({ error: "Invalid Category" });
    }
    const docItem = page.documents.id(itemId);
    if (!docItem) {
      return res.status(404).json({ error: "Publication item not found." });
    }
    if (title !== undefined) docItem.title = title;
    if (category !== undefined) docItem.category = category;
    if (req.file) {
      docItem.fileUrl = req.file.filename;
    }
    await page.save();
    return res.status(200).json({
      message: "Publication item updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updatePublicationItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating publication item." });
  }
};

/**
 * DELETE /api/publication/items/:itemId
 * Admin-only endpoint: Delete a publicationDocument item.
 */
exports.deletePublicationItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    let page = await PublicationPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Publication page not found." });
    }
    const docItem = page.documents.id(itemId);
    if (!docItem) {
      return res.status(404).json({ error: "Publication item not found." });
    }
    page.documents.pull(itemId);
    await page.save();
    return res.status(200).json({
      message: "Publication item deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deletePublicationItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting publicationDocument item." });
  }
};
