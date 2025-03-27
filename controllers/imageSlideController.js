const ImageSlide = require("../models/imageSlide");
const createUploader = require("../middleware/uploader");

// Multer instance: storing images under /uploads/imageSlides
const imageSlideUploader = createUploader("imageSlides").single("sliderImage");

// This middleware will handle the file upload before we create/update the slide
exports.uploadSlideImageMiddleware = (req, res, next) => {
  imageSlideUploader(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/image-slides
 * Public endpoint: returns all slides in the order you want
 */
exports.getAllSlides = async (req, res) => {
  try {
    // Sort by 'order' ascending or by created date, depends on your preference
    const slides = await ImageSlide.find().sort({ order: 1 });
    return res.status(200).json(slides);
  } catch (error) {
    console.error("getAllSlides Error:", error);
    return res.status(500).json({ error: "Server error fetching slides." });
  }
};

/**
 * POST /api/image-slides
 * Admin or superadmin only, form-data with fields:
 *   order (optional), sliderImage (file)
 */
exports.createSlide = async (req, res) => {
  try {
    let page = await ImageSlide.findOne();
    if (!page) {
      page = new ImageSlide();
      await page.save();
    }

    const { order } = req.body;

    await page.save();

    if (req.file) {
      let newImage = {
        order: order || 0,
      };
      newImage.sliderImage = req.file.filename;
      // push newImage object to page.images
      page.image.push(newImage);
    }

    await page.save();
    return res.status(201).json({
      message: "Image added to page.",
      page,
    });
  } catch (error) {
    console.error("addImageToSlider Error:", error);
    return res
      .status(500)
      .json({ error: "Server error adding image to slider." });
  }
};
/**
 * DELETE /api/image-slides/:itemId
 * Admin or superadmin only: delete a slide
 */
exports.deleteSlide = async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log(itemId);
    let page = await ImageSlide.findOne();
    if (!page) {
      return res.status(404).json({ error: "No slider found." });
    }

    const imageItem = page.image.id(itemId);
    if (!imageItem) {
      return res.status(404).json({ error: "Image not found in slider." });
    }

    page.image.pull(itemId);

    await page.save();
    return res.status(200).json({
      message: "Slider image removed.",
      page,
    });
  } catch (error) {
    console.error("deleteSliderImage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting slider image." });
  }
};
