const TestimonialsPage = require("../models/testimonials");
const createUploader = require("../middleware/uploader");
const path = require("path");
// Multer for "testimonials" images
const testimonialUploader =
  createUploader("testimonials").single("testimonialImage");

exports.uploadTestimonialImageMiddleware = (req, res, next) => {
  testimonialUploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/testimonials
 * Public: returns the single testimonials page doc
 */
exports.getTestimonialsPage = async (req, res) => {
  try {
    let page = await TestimonialsPage.findOne();
    if (!page) {
      page = new TestimonialsPage();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getTestimonialsPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching testimonials page." });
  }
};

/**
 * POST /api/testimonials
 * Admin only: update the page-level info (pageTitle, pageSubtitle).
 */
exports.updateTestimonialsPage = async (req, res) => {
  try {
    const { pageTitle, pageSubtitle, pageDescription } = req.body;

    let page = await TestimonialsPage.findOne();
    if (!page) {
      page = new TestimonialsPage();
    }

    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    if (pageSubtitle !== undefined) page.pageSubtitle = pageSubtitle;
    if (pageDescription !== undefined) page.pageDescription = pageDescription;

    await page.save();
    return res.status(200).json({
      message: "Testimonials page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateTestimonialsPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating testimonials page." });
  }
};

/**
 * POST /api/testimonials/items
 * Admin only: Add a new testimonial item.
 * If there's an programImage, it's uploaded with Multer.
 */
exports.addTestimonialItem = async (req, res) => {
  try {
    const { name, location, rating, quote } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required." });
    }

    let page = await TestimonialsPage.findOne();
    if (!page) {
      page = new TestimonialsPage();
      await page.save();
    }

    let imageName = "";
    if (req.file) {
      imageName = req.file.filename;
    }

    page.testimonials.push({
      name,
      location: location || "",
      testimonialImage: imageName,
      rating: rating ? Number(rating) : 5,
      quote: quote || "",
    });

    await page.save();
    return res.status(201).json({
      message: "Testimonial item added successfully.",
      page,
    });
  } catch (error) {
    console.error("addTestimonialItem Error:", error);
    return res.status(500).json({ error: "Server error adding testimonial." });
  }
};

/**
 * PATCH /api/testimonials/items/:testimonialId
 * Admin only: update a single testimonial subdoc
 * Body: { name, location, rating, quote }
 */
exports.updateTestimonialItem = async (req, res) => {
  try {
    const { testimonialId } = req.params;
    const { name, location, rating, quote } = req.body;

    let page = await TestimonialsPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Testimonials page not found." });
    }

    const item = page.testimonials.id(testimonialId);
    if (!item) {
      return res.status(404).json({ error: "Testimonial not found." });
    }

    if (name !== undefined) item.name = name;
    if (location !== undefined) item.location = location;
    if (rating !== undefined) item.rating = Number(rating);
    if (quote !== undefined) item.quote = quote;

    // If new file uploaded
    if (req.file) {
      item.testimonialImage = path.basename(req.file.path);
    }

    await page.save();
    return res.status(200).json({
      message: "Testimonial updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateTestimonialItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating testimonial." });
  }
};

/**
 * DELETE /api/testimonials/items/:testimonialId
 * Admin only: remove a testimonial from the array
 */
exports.deleteTestimonialItem = async (req, res) => {
  try {
    const { testimonialId } = req.params;
    let page = await TestimonialsPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Testimonials page not found." });
    }

    // find the subdocc
    const item = page.testimonials.id(testimonialId);
    if (!item) {
      return res.status(404).json({ error: "Testimonial not found." });
    }

    // remove subdoc
    page.testimonials.pull(testimonialId);

    await page.save();
    return res.status(200).json({
      message: "Testimonial deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteTestimonialItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting testimonial." });
  }
};
