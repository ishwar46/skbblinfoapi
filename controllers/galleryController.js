const Gallery = require("../models/Gallery");
const createUploader = require("../middleware/uploader");
const sizeOf = require("image-size");

// This creates an uploader that stores files under /uploads/gallery
const galleryUploader = createUploader("gallery").single("galleryImage");

// Then a middleware wrapper:
exports.uploadGalleryImageMiddleware = (req, res, next) => {
  galleryUploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/gallery
 * Public endpoint: returns the single Gallery doc (pageTitle, pageSubtitle, images).
 */

exports.getGallery = async (req, res) => {
  try {
    // If we have exactly one doc, we can do findOne()
    let gallery = await Gallery.findOne();
    if (!gallery) {
      gallery = new Gallery();
      await gallery.save();
    }
    return res.status(200).json(gallery);
  } catch (error) {
    console.error("getGallery Error:", error);
    return res.status(500).json({ error: "Server error fetching gallery." });
  }
};

/**
 * POST /api/gallery
 * Admin only: create a new gallery doc (if you want multiple galleries),
 * or update the existing single doc with pageTitle/pageSubtitle.
 *
 * Body: { pageTitle, pageSubtitle }
 */
exports.updateGalleryInfo = async (req, res) => {
  try {
    const { pageTitle, pageSubtitle } = req.body;

    // if single doc, findOne or create
    let gallery = await Gallery.findOne();
    if (!gallery) {
      gallery = new Gallery();
    }

    if (pageTitle !== undefined) gallery.pageTitle = pageTitle;
    if (pageSubtitle !== undefined) gallery.pageSubtitle = pageSubtitle;

    await gallery.save();
    return res.status(200).json({
      message: "Gallery info updated successfully.",
      gallery,
    });
  } catch (error) {
    console.error("updateGalleryInfo Error:", error);
    return res.status(500).json({ error: "Server error updating gallery." });
  }
};

/**
 * POST /api/gallery/images
 * Admin only: add a new image to the gallery (with optional upload via Multer).
 *
 * Body: { title, description, order } + (file uploaded)
 */

exports.addImageToGallery = async (req, res) => {
  try {
    let gallery = await Gallery.findOne();
    if (!gallery) {
      gallery = new Gallery();
      await gallery.save();
    }

    const { title, description, order } = req.body;

    let newImage = {
      title: title || "",
      description: description || "",
      order: order || 0,
    };

    if (req.file) {
      newImage.image = req.file.path;
      newImage.imageName = req.file.filename;
      newImage.fileSize = req.file.size;
      const dimensions = sizeOf(req.file.path);
      newImage.width = dimensions.width;
      newImage.height = dimensions.height;
    }

    // push newImage object to gallery.images
    gallery.images.push(newImage);

    await gallery.save();
    return res.status(201).json({
      message: "Image added to gallery.",
      gallery,
    });
  } catch (error) {
    console.error("addImageToGallery Error:", error);
    return res
      .status(500)
      .json({ error: "Server error adding image to gallery." });
  }
};

/**
 * PATCH /api/gallery/images/:imageId
 * Admin only: update an existing image in the gallery
 * Body: { title, description, order } + optional file upload
 */
exports.updateGalleryImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    console.log("imageId:", req);
    let gallery = await Gallery.findOne();
    if (!gallery) {
      return res.status(404).json({ error: "No gallery found." });
    }

    const imageItem = gallery.images.id(imageId);
    if (!imageItem) {
      return res.status(404).json({ error: "Image not found in gallery." });
    }

    const { title, description, order } = req.body;
    if (title !== undefined) imageItem.title = title;
    if (description !== undefined) imageItem.description = description;
    if (order !== undefined) imageItem.order = order;

    // If a new file was uploaded, update path, size, dimensions
    if (req.file) {
      imageItem.imageName = req.file.filename;
      imageItem.fileSize = req.file.size;
      const dimensions = sizeOf(req.file.path);
      imageItem.width = dimensions.width;
      imageItem.height = dimensions.height;
    }

    await gallery.save();
    return res.status(200).json({
      message: "Gallery image updated.",
      gallery,
    });
  } catch (error) {
    console.error("updateGalleryImage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating gallery image." });
  }
};

/**
 * DELETE /api/gallery/images/:imageId
 * Admin only: remove an image from the gallery
 */
exports.deleteGalleryImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    let gallery = await Gallery.findOne();
    if (!gallery) {
      return res.status(404).json({ error: "No gallery found." });
    }

    const imageItem = gallery.images.id(imageId);
    if (!imageItem) {
      return res.status(404).json({ error: "Image not found in gallery." });
    }

    // Remove the subdocument
    gallery.images.pull(imageId);

    await gallery.save();
    return res.status(200).json({
      message: "Gallery image removed.",
      gallery,
    });
  } catch (error) {
    console.error("deleteGalleryImage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting gallery image." });
  }
};
