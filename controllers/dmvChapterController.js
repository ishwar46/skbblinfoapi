const DMVChapterPage = require("../models/DMVChapterPage");

/**
 * GET /api/dmv-chapter
 * Public endpoint: Retrieve the DMV Chapter page with populated member details.
 */
exports.getDMVChapterPage = async (req, res) => {
  try {
    let page = await DMVChapterPage.findOne().populate(
      "members.user",
      "fullName profilePicture email"
    );
    if (!page) {
      page = new DMVChapterPage({
        pageTitle: "Washington DC, Virginia & Maryland Chapter",
        pageDescription:
          "Meet our DMV Chapter members who lead our regional initiatives.",
      });
      await page.save();
      page = await DMVChapterPage.findOne().populate(
        "members.user",
        "fullName profilePicture email"
      );
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getDMVChapterPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching DMV Chapter page." });
  }
};

/**
 * PUT /api/dmv-chapter
 * Admin-only endpoint: Update the DMV Chapter page-level info (title and description).
 * Expected JSON body: { pageTitle, pageDescription }
 */
exports.updateDMVChapterPage = async (req, res) => {
  try {
    const { pageTitle, pageDescription } = req.body;
    let page = await DMVChapterPage.findOne();
    if (!page) {
      page = new DMVChapterPage();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    if (pageDescription !== undefined) page.pageDescription = pageDescription;
    await page.save();
    return res.status(200).json({
      message: "DMV Chapter page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateDMVChapterPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating DMV Chapter page." });
  }
};

/**
 * POST /api/dmv-chapter/members
 * Admin-only endpoint: Add a new DMV Chapter member.
 * Expected JSON body:
 * {
 *   "user": "<User ObjectId>",
 *   "designation": "Regional Director"
 * }
 */
exports.addDMVMember = async (req, res) => {
  try {
    const { user, designation } = req.body;
    if (!user || !designation) {
      return res
        .status(400)
        .json({ error: "User and designation are required." });
    }
    let page = await DMVChapterPage.findOne();
    if (!page) {
      page = new DMVChapterPage();
      await page.save();
    }
    page.members.push({ user, designation });
    await page.save();
    page = await DMVChapterPage.findOne().populate(
      "members.user",
      "fullName profilePicture email"
    );
    return res.status(201).json({
      message: "DMV Chapter member added successfully.",
      page,
    });
  } catch (error) {
    console.error("addDMVMember Error:", error);
    return res
      .status(500)
      .json({ error: "Server error adding DMV Chapter member." });
  }
};

/**
 * PATCH /api/dmv-chapter/members/:memberId
 * Admin-only endpoint: Update an existing DMV Chapter member.
 * Expected JSON body: { user, designation } (either or both)
 */
exports.updateDMVMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { user, designation } = req.body;
    let page = await DMVChapterPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "DMV Chapter page not found." });
    }
    const member = page.members.id(memberId);
    if (!member) {
      return res.status(404).json({ error: "Committee member not found." });
    }
    if (user !== undefined) member.user = user;
    if (designation !== undefined) member.designation = designation;
    await page.save();
    page = await DMVChapterPage.findOne().populate(
      "members.user",
      "fullName profilePicture email"
    );
    return res.status(200).json({
      message: "DMV Chapter member updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateDMVMember Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating DMV Chapter member." });
  }
};

/**
 * DELETE /api/dmv-chapter/members/:memberId
 * Admin-only endpoint: Delete a DMV Chapter member.
 */
exports.deleteDMVMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    let page = await DMVChapterPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "DMV Chapter page not found." });
    }
    const member = page.members.id(memberId);
    if (!member) {
      return res.status(404).json({ error: "Member not found." });
    }
    page.members.pull(memberId);
    await page.save();
    page = await DMVChapterPage.findOne().populate(
      "members.user",
      "fullName profilePicture email"
    );
    return res.status(200).json({
      message: "DMV Chapter member deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteDMVMember Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting DMV Chapter member." });
  }
};
