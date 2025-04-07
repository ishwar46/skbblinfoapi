/**
 * GET /api/footer
 * Public endpoint: returns the single footer doc).
 */

const Footer = require("../models/Footer");
const validator = require("validator");

exports.getFooter = async (req, res) => {
  try {
    // If we have exactly one doc, we can do findOne()
    let footer = await Footer.findOne();
    if (!footer) {
      footer = new Footer();
      await footer.save();
    }
    return res.status(200).json(footer);
  } catch (error) {
    console.error("getFooter Error:", error);
    return res.status(500).json({ error: "Server error fetching footer." });
  }
};

/**
 * PATCH /api/footer
 * Public endpoint: returns the single footer doc).
 */

exports.updateFooter = async (req, res) => {
  try {
    const {
      youtubeLink,
      facebookLink,
      instagramLink,
      firstLinkTitle,
      secondLinkTitle,
      newsLetterCTA,
      bottomFooterCopyright,
      newsLetterCTASubtitle,
    } = req.body;

    let page = await Footer.findOne();
    if (!page) page = new Footer();

    // Helper function to validate and fix URLs
    const validateUrl = (url) => {
      if (!url) return undefined;
      return validator.isURL(url, {
        protocols: ["http", "https"],
        require_protocol: true,
      })
        ? url
        : `https://${url}`;
    };

    if (youtubeLink !== undefined) page.youtubeLink = validateUrl(youtubeLink);
    if (facebookLink !== undefined)
      page.facebookLink = validateUrl(facebookLink);
    if (instagramLink !== undefined)
      page.instagramLink = validateUrl(instagramLink);
    if (firstLinkTitle !== undefined) page.firstLinkTitle = firstLinkTitle;
    if (secondLinkTitle !== undefined) page.secondLinkTitle = secondLinkTitle;
    if (newsLetterCTA !== undefined) page.newsLetterCTA = newsLetterCTA;
    if (bottomFooterCopyright !== undefined)
      page.bottomFooterCopyright = bottomFooterCopyright;
    if (newsLetterCTA !== undefined) page.newsLetterCTA = newsLetterCTA;
    if (newsLetterCTASubtitle !== undefined)
      page.newsLetterCTASubtitle = newsLetterCTASubtitle;

    await page.save();
    return res.status(200).json({
      message: "Footer updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateFooter Error:", error);
    return res.status(500).json({ error: "Server error updating footer" });
  }
};

/**
 * POST /api/footer/items
 * Public endpoint: returns the single footer doc).
 */

exports.addToList = async (req, res) => {
  try {
    const { title, link, listType } = req.body;
    if (!title || !link || !listType) {
      return res
        .status(400)
        .json({ error: "Title, link, and list type are required." });
    }

    const validateUrl = (url) => {
      return validator.isURL(url, {
        protocols: ["http", "https"],
        require_protocol: true,
      })
        ? url
        : `https://${url}`;
    };

    const validLink = validateUrl(link);
    let page = await Footer.findOne();
    if (!page) {
      page = new Footer();
      await page.save();
    }

    const newList = { title, link: validLink };

    switch (listType) {
      case "firstLink":
        page.firstLink.push(newList);
        break;
      case "secondLink":
        page.secondLink.push(newList);
        break;
      default:
        return res.status(400).json({ error: "Invalid list type." });
    }

    await page.save();
    return res
      .status(201)
      .json({ message: `List item added successfully to ${listType}.`, page });
  } catch (error) {
    console.error("addToList Error:", error);
    return res.status(500).json({ error: "Server error adding list item." });
  }
};

exports.deleteFromList = async (req, res) => {
  try {
    const { id, listType } = req.body;
    if (!id || !listType) {
      return res.status(400).json({ error: "ID and list type are required." });
    }

    let page = await Footer.findOne();
    if (!page) {
      return res.status(404).json({ error: "Footer document not found." });
    }

    if (!["firstLink", "secondLink", "bottomFooter"].includes(listType)) {
      return res.status(400).json({ error: "Invalid list type." });
    }

    // Use Mongoose's `pull()` method to remove the item by ID
    page[listType].pull(id);

    await page.save();
    return res.status(200).json({
      message: `List item removed successfully from ${listType}.`,
      page,
    });
  } catch (error) {
    console.error("deleteFromList Error:", error);
    return res.status(500).json({ error: "Server error removing list item." });
  }
};
