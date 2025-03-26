const StoryPage = require("../models/storyPageModel");
const createUploader = require("../middleware/uploader");
const storyUploader = createUploader("stories").single("storyImage");
const path = require("path");

/**
 * Middleware to handle story image upload.
 * Expects form-data with a field named "storyImage"
 */
exports.uploadStoryImageMiddleware = (req, res, next) => {
  storyUploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/stories
 * Public endpoint: Returns the StoryPage document.
 */
exports.getStoryPage = async (req, res) => {
  try {
    let page = await StoryPage.findOne();
    if (!page) {
      // Create a default StoryPage if none exists
      page = new StoryPage({
        pageTitle: "Our Stories",
        pageDescription: "Discover inspiring stories from our community.",
      });
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getStoryPage Error:", error);
    return res.status(500).json({ error: "Server error fetching story page." });
  }
};

/**
 * POST /api/stories
 * Admin-only endpoint: Create a new StoryPage document if none exists.
 * (If a document already exists, use PUT to update the page-level info.)
 */
exports.createStoryPage = async (req, res) => {
  try {
    const { pageTitle, pageDescription } = req.body;
    let existing = await StoryPage.findOne();
    if (existing) {
      return res.status(400).json({ error: "Story page already exists." });
    }
    const page = new StoryPage({
      pageTitle: pageTitle || "Our Stories",
      pageDescription: pageDescription || "",
    });
    await page.save();
    return res.status(201).json({
      message: "Story page created successfully.",
      page,
    });
  } catch (error) {
    console.error("createStoryPage Error:", error);
    return res.status(500).json({ error: "Server error creating story page." });
  }
};

/**
 * PUT /api/stories
 * Admin-only endpoint: Update the page-level info (pageTitle, pageDescription).
 */
exports.updateStoryPage = async (req, res) => {
  try {
    const { pageTitle, pageDescription } = req.body;
    let page = await StoryPage.findOne();
    if (!page) {
      page = new StoryPage();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    if (pageDescription !== undefined) page.pageDescription = pageDescription;
    await page.save();
    return res.status(200).json({
      message: "Story page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateStoryPage Error:", error);
    return res.status(500).json({ error: "Server error updating story page." });
  }
};

/**
 * POST /api/stories/items
 * Admin-only endpoint: Add a new story item.
 * Expected form-data fields: title, subtitle, fullStory, , vids (optional as JSON string).
 * Optional file field: "storyImage" for a single image.
 */
exports.addStoryItem = async (req, res) => {
  try {
    const { title, subtitle, fullStory, vids } = req.body;
    if (!title || !fullStory) {
      return res
        .status(400)
        .json({ error: "Title and full story are required." });
    }
    let page = await StoryPage.findOne();
    if (!page) {
      page = new StoryPage();
      await page.save();
    }

    let imageName = "";
    if (req.file) {
      imageName = req.file.filename;
    }
    let parsedVids = [];
    if (vids) {
      try {
        parsedVids = typeof vids === "string" ? JSON.parse(vids) : vids;
      } catch (e) {
        return res.status(400).json({
          error: "Invalid format for vids. It should be a JSON array.",
        });
      }
    }
    // Create new story item
    const newStory = {
      title,
      subtitle: subtitle || "",
      fullStory,
      postedAt: new Date(),
      storyImage: imageName ? [imageName] : [],
      vids: parsedVids,
    };
    page.stories.push(newStory);
    await page.save();
    return res.status(201).json({
      message: "Story item added successfully.",
      page,
    });
  } catch (error) {
    console.error("addStoryItem Error:", error);
    return res.status(500).json({ error: "Server error adding story item." });
  }
};

/**
 * PATCH /api/stories/items/:storyId
 * Admin-only endpoint: Update a specific story item.
 * Expected form-data: Fields to update (title, subtitle, fullStory, , vids).
 * Optional file field "storyImage" to replace image.
 */
exports.updateStoryItem = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { title, subtitle, fullStory, vids } = req.body;
    let page = await StoryPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Story page not found." });
    }
    const storyItem = page.stories.id(storyId);
    if (!storyItem) {
      return res.status(404).json({ error: "Story item not found." });
    }
    if (title !== undefined) storyItem.title = title;
    if (subtitle !== undefined) storyItem.subtitle = subtitle;
    if (fullStory !== undefined) storyItem.fullStory = fullStory;
    if (vids !== undefined) {
      try {
        storyItem.vids = typeof vids === "string" ? JSON.parse(vids) : vids;
      } catch (e) {
        return res.status(400).json({ error: "Invalid format for vids." });
      }
    }
    if (req.file) {
      storyItem.storyImage = path.basename(req.file.path);
    }

    await page.save();
    return res.status(200).json({
      message: "Story item updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateStoryItem Error:", error);
    return res.status(500).json({ error: "Server error updating story item." });
  }
};

/**
 * DELETE /api/stories/items/:storyId
 * Admin-only endpoint: Delete a story item.
 */
exports.deleteStoryItem = async (req, res) => {
  try {
    const { storyId } = req.params;
    let page = await StoryPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Story page not found." });
    }
    const storyItem = page.stories.id(storyId);
    if (!storyItem) {
      return res.status(404).json({ error: "Story item not found." });
    }
    page.stories.pull(storyId);
    await page.save();
    return res.status(200).json({
      message: "Story item deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteStoryItem Error:", error);
    return res.status(500).json({ error: "Server error deleting story item." });
  }
};

/**
 * (Optional) DELETE /api/stories
 * Admin-only endpoint: Delete the entire StoryPage document.
 */
exports.deleteStoryPage = async (req, res) => {
  try {
    const result = await StoryPage.deleteMany();
    return res.status(200).json({
      message: "Story page deleted successfully.",
      result,
    });
  } catch (error) {
    console.error("deleteStoryPage Error:", error);
    return res.status(500).json({ error: "Server error deleting story page." });
  }
};
