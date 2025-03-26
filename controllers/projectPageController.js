const ProjectPage = require("../models/projectPage");
const createUploader = require("../middleware/uploader");
const sizeOf = require("image-size");

// This creates an uploader that stores files under /uploads/projects
const aboutUsUploader = createUploader("project").fields([
  { name: "projectLogo", maxCount: 1 },
  { name: "projectImages", maxCount: 5 },
]);

exports.uploadProjectImageMiddleware = (req, res, next) => {
  aboutUsUploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// Middleware wrapper for file uploads
exports.uploadProjectImageMiddleware = (req, res, next) => {
  aboutUsUploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/page
 * Public endpoint: returns the single ProjectPage doc (pageTitle, pageSubtitle, images).
 */

exports.getProjectPage = async (req, res) => {
  try {
    // If we have exactly one doc, we can do findOne()
    let page = await ProjectPage.findOne();
    if (!page) {
      page = new ProjectPage();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getProjectPage Error:", error);
    return res.status(500).json({ error: "Server error fetching page." });
  }
};

/**
 * POST /api/page
 * Admin only: create a new page doc (if you want multiple galleries),
 * or update the existing single doc with pageTitle/pageSubtitle.
 *
 * Body: { pageTitle, pageSubtitle }
 */
exports.updateProjectPageInfo = async (req, res) => {
  try {
    const { pageTitle } = req.body;

    // if single doc, findOne or create
    let page = await ProjectPage.findOne();
    if (!page) {
      page = new ProjectPage();
    }

    if (pageTitle !== undefined) page.pageTitle = pageTitle;

    await page.save();
    return res.status(200).json({
      message: "ProjectPage info updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateProjectPageInfo Error:", error);
    return res.status(500).json({ error: "Server error updating page." });
  }
};

/**
 * POST /api/project/images
 * Admin only: add a new project to the page (with optional upload via Multer).
 *
 * Body: { title, descriptionParagraph } + (file uploaded)
 */

exports.addProjectToProjectPage = async (req, res) => {
  try {
    let page = await ProjectPage.findOne();
    if (!page) {
      page = new ProjectPage();
      await page.save();
    }

    const { title, descriptionParagraph } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }
    if (!descriptionParagraph) {
      return res
        .status(400)
        .json({ error: "DescriptionParagraph is required." });
    }
    let newProject = {
      title: title || "",
      descriptionParagraph: Array.isArray(descriptionParagraph)
        ? descriptionParagraph
        : [descriptionParagraph || ""],
      projectLogo: req.files?.projectLogo?.[0]?.filename || "", // Store project logo
      projectImages:
        req.files?.projectImages?.map((file) => file.filename) || [], // Store multiple images
    };

    if (!Array.isArray(page.projects)) {
      page.projects = [];
    }

    page.projects.push(newProject);
    await page.save();

    return res.status(201).json({
      message: "Project added successfully.",
      page,
    });
  } catch (error) {
    console.error("addImageToProjectPage Error:", error);
    return res.status(500).json({ error: "Server error adding project." });
  }
};

/**
 * PATCH /api/project/images/:itemId
 * Admin only: update an existing image in the page
 * Body: { title, descriptionParagraph } + optional file upload
 */
exports.updateProjectPageImage = async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log("itemId:", itemId);

    let page = await ProjectPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "No page found." });
    }

    // Find the project inside projects array
    const projectItem = page.projects.id(itemId);
    if (!projectItem) {
      return res.status(404).json({ error: "Project not found in page." });
    }

    const { title, descriptionParagraph } = req.body;
    if (title !== undefined) projectItem.title = title;
    if (descriptionParagraph !== undefined)
      projectItem.descriptionParagraph = Array.isArray(descriptionParagraph)
        ? descriptionParagraph
        : [descriptionParagraph];

    // If a new file was uploaded, add it to projectImages
    if (req.file) {
      projectItem.projectImages.push(req.file.filename); // Push new image to array
    }

    await page.save();
    return res.status(200).json({
      message: "Project updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateProjectPage Error:", error);
    return res.status(500).json({ error: "Server error updating project." });
  }
};

/**
 * DELETE /api/project/images/:itemId
 * Admin only: remove an image from the page
 */
exports.deleteProjectPageImage = async (req, res) => {
  try {
    const { itemId } = req.params;
    let page = await ProjectPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "No page found." });
    }

    const imageItem = page.projects.id(itemId);
    if (!imageItem) {
      return res.status(404).json({ error: "Project not found in page." });
    }

    // Remove the subdocument
    page.projects.pull(itemId);

    await page.save();
    return res.status(200).json({
      message: "ProjectPage image removed.",
      page,
    });
  } catch (error) {
    console.error("deleteProjectPageImage Error:", error);
    return res.status(500).json({ error: "Server error deleting page image." });
  }
};
