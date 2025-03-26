const Branches = require("../models/Branches");

/**
 * GET /api/branches
 * Public: Returns the Branches document (pageTitle, pageSubtitle, branches array)
 */
exports.getBranches = async (req, res) => {
  try {
    let page = await Branches.findOne();
    if (!page) {
      page = new Branches();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getBranches Error:", error);
    return res.status(500).json({ error: "Server error fetching branches." });
  }
};

/**
 * POST /api/branches
 * Admin Only: Update page-level info (pageTitle, pageSubtitle)
 */
exports.updateBranchPage = async (req, res) => {
  try {
    const { pageTitle } = req.body;
    let page = await Branches.findOne();
    if (!page) {
      page = new Branches();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    await page.save();
    return res.status(200).json({
      message: "Blog page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateBranchPage Error:", error);
    return res.status(500).json({ error: "Server error updating blog page." });
  }
};

/**
 * POST /api/branches/items
 * Admin Only: Add a new branch
 * Expects form-data with fields: title, description, fullContent, and file field "blogImage"
 */
exports.addBranch = async (req, res) => {
  try {
    const { branchName, manager, location, contact, email } = req.body;
    if (!branchName) {
      return res.status(400).json({ error: "Title is required." });
    }
    if (!manager) {
      return res.status(400).json({ error: "Manager is required." });
    }
    if (!location) {
      return res.status(400).json({ error: "Location is required." });
    }
    if (!contact) {
      return res.status(400).json({ error: "Contact is required." });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    let page = await Branches.findOne();
    if (!page) {
      page = new Branches();
      await page.save();
    }

    page.branches.push({
      branchName,
      manager,
      location,
      contact,
      email,
    });

    await page.save();
    return res.status(201).json({
      message: "Branch added successfully.",
      page,
    });
  } catch (error) {
    console.error("addBranch Error:", error);
    return res.status(500).json({ error: "Server error adding branch." });
  }
};

/**
 * PATCH /api/branches/items/:itemId
 * Admin Only: Update an existing branch.
 * Expects form-data (if uploading a new image) and JSON fields for updates.
 */
exports.updateBranch = async (req, res) => {
  try {
    const { itemId } = req.params;

    const { branchName, manager, location, contact, email } = req.body;

    let page = await Branches.findOne();
    if (!page) {
      return res.status(404).json({ error: "Blog page not found." });
    }

    const item = page.branches.id(itemId);
    if (!item) {
      return res.status(404).json({ error: "Branch not found." });
    }

    if (branchName !== undefined) item.branchName = branchName;
    if (manager !== undefined) item.manager = manager;
    if (location !== undefined) item.location = location;
    if (contact !== undefined) item.contact = contact;
    if (email !== undefined) item.email = email;

    await page.save();
    return res.status(200).json({
      message: "Branch updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateBranch Error:", error);
    return res.status(500).json({ error: "Server error updating branch." });
  }
};

/**
 * DELETE /api/branches/items/:itemId
 * Admin Only: Remove a branch from the array.
 */
exports.deleteBranch = async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log(itemId);
    let page = await Branches.findOne();
    if (!page) {
      return res.status(404).json({ error: "Branch page not found." });
    }

    const item = page.branches.id(itemId);
    if (!item) {
      return res.status(404).json({ error: "Branch not found." });
    }

    // Remove the branch
    page.branches.pull(itemId);
    await page.save();
    return res.status(200).json({
      message: "Branch deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteBranch Error:", error);
    return res.status(500).json({ error: "Server error deleting branch." });
  }
};
