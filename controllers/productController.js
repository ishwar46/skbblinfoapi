const Product = require("../models/productPage");
const createUploader = require("../middleware/uploader");

// This creates an uploader that stores files under /uploads/page
const uploadProductImageMiddleware = createUploader("Product").fields([
  { name: "programThumbnail", maxCount: 1 },
  { name: "programImages", maxCount: 5 },
]);

exports.uploadProductImageMiddleware = (req, res, next) => {
  uploadProductImageMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/programs
 * Public: returns the single programs page doc with Products array
 */
exports.getProductPage = async (req, res) => {
  try {
    let page = await Product.findOne();
    if (!page) {
      // If not found, create a default doc
      page = new Product();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getProductPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching product and service page." });
  }
};

/**
 * POST /api/product/items
 * Admin only: add a new product to the page (with optional upload via Multer).
 *
 * Body: { title, descriptionParagraph } + (file uploaded)
 */

exports.addProjectToProjectPage = async (req, res) => {
  try {
    let page = await Product.findOne();
    if (!page) {
      page = new Product();
      await page.save();
    }

    const { title, descriptionParagraph, programType } = req.body;

    if (!title) return res.status(400).json({ error: "Title is required." });
    if (!descriptionParagraph)
      return res
        .status(400)
        .json({ error: "DescriptionParagraph is required." });
    if (!programType || !["Loan", "Service"].includes(programType))
      return res
        .status(400)
        .json({ error: "Invalid Program Type (Loan/Service) is required." });

    let newProject = {
      title,
      descriptionParagraph: Array.isArray(descriptionParagraph)
        ? descriptionParagraph
        : [descriptionParagraph || ""],
      programType,
      programThumbnail: req.files?.programThumbnail?.[0]?.filename || "",
      programImages:
        req.files?.programImages?.map((file) => file.filename) || [],
    };

    if (!Array.isArray(page.productAndServices)) {
      page.productAndServices = [];
    }

    page.productAndServices.push(newProject);
    await page.save();

    return res.status(201).json({
      message: "Project added successfully.",
      page,
    });
  } catch (error) {
    console.error("addProjectToProjectPage Error:", error);
    return res.status(500).json({ error: "Server error adding product." });
  }
};

/**
 * PATCH /api/product/items/:itemId
 * Admin only: update an existing image in the page
 * Body: { title, descriptionParagraph } + optional file upload
 */
exports.updateProjectPageImage = async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log("itemId:", itemId);

    let page = await Product.findOne();
    if (!page) {
      return res.status(404).json({ error: "No page found." });
    }

    // Find the project inside productAndServices array
    const projectItem = page.productAndServices.id(itemId);
    if (!projectItem) {
      return res.status(404).json({ error: "Project not found in page." });
    }

    const { title, descriptionParagraph, programType } = req.body;

    if (title !== undefined) projectItem.title = title;

    if (programType !== undefined) {
      if (!["Loan", "Service"].includes(programType)) {
        return res
          .status(400)
          .json({ error: "Invalid Program Type (Loan/Service)." });
      }
      projectItem.programType = programType;
    }

    if (descriptionParagraph !== undefined)
      projectItem.descriptionParagraph = Array.isArray(descriptionParagraph)
        ? descriptionParagraph
        : [descriptionParagraph];

    // Handle file uploads
    if (req.files?.programThumbnail?.length > 0) {
      projectItem.programThumbnail = req.files.programThumbnail[0].filename;
    }

    if (req.files?.programImages?.length > 0) {
      projectItem.programImages.push(
        ...req.files.programImages.map((file) => file.filename)
      );
    }

    await page.save();
    return res.status(200).json({
      message: "Project updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateProjectPage Error:", error);
    return res.status(500).json({ error: "Server error updating product." });
  }
};

/**
 * DELETE /api/product/items/:itemId
 * Admin only: remove an image from the page
 */
exports.deleteProjectPageImage = async (req, res) => {
  try {
    const { itemId } = req.params;
    let page = await Product.findOne();
    if (!page) {
      return res.status(404).json({ error: "No page found." });
    }

    const imageItem = page.productAndServices.id(itemId);
    if (!imageItem) {
      return res.status(404).json({ error: "Project not found in page." });
    }

    // Remove the subdocument
    page.productAndServices.pull(itemId);

    await page.save();
    return res.status(200).json({
      message: "Product image removed.",
      page,
    });
  } catch (error) {
    console.error("deleteProjectPageImage Error:", error);
    return res.status(500).json({ error: "Server error deleting page image." });
  }
};
