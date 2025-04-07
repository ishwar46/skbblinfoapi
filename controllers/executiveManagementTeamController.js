const ExecutiveManagementTeamPage = require("../models/executiveManagementTeamPage");

const roleHierarchy = {
  CEO: 1,
  "Deputy CEO": 2,
  "Chief Manger": 3,
};

/**
 * GET /api/executive-management
 * Public endpoint to retrieve the Executive Management page details,
 * including populated management member information, sorted by hierarchy.
 */
exports.getExecutiveManagementPage = async (req, res) => {
  try {
    let page = await ExecutiveManagementTeamPage.findOne();

    if (!page) {
      // Create a default page if it doesn't exist
      page = new ExecutiveManagementTeamPage({
        pageTitle: "Management Team",
      });
      await page.save();
    }

    // Sort management members based on role hierarchy
    page.managementMembers.sort((a, b) => {
      return (
        (roleHierarchy[a.designation] || 99) -
        (roleHierarchy[b.designation] || 99)
      );
    });

    return res.status(200).json(page);
  } catch (error) {
    console.error("getExecutiveManagementPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching executive management page." });
  }
};

/**
 * PUT /api/executive-management
 * Admin-only endpoint: Update the page-level information.
 * Expected JSON body: { pageTitle }
 */
exports.updateExecutiveManagementPage = async (req, res) => {
  try {
    const { pageTitle } = req.body;
    let page = await ExecutiveManagementTeamPage.findOne();
    if (!page) {
      page = new ExecutiveManagementTeamPage();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    await page.save();
    return res.status(200).json({
      message: "Executive management page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateExecutiveManagementPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating executive management page." });
  }
};

/**
 * POST /api/executive-management/items
 * Admin-only endpoint: Add a new management member.
 * Expected JSON body:
 * {
 *   "userName": "<User ObjectId>",
 *   "designation": "President"
 *   "designationText": "I am the president"
 * }
 */
exports.addManagementMember = async (req, res) => {
  try {
    const { userName, designation, designationText } = req.body;
    if (!userName || !designation) {
      return res
        .status(400)
        .json({ error: "Username and designation are required." });
    }

    let page = await ExecutiveManagementTeamPage.findOne();
    if (!page) {
      page = new ExecutiveManagementTeamPage();
      await page.save();
    }

    // Check if the userName already exists in managementMembers
    const isAlreadyMember = page.managementMembers.some(
      (member) => member.userName.toString() === userName
    );
    if (isAlreadyMember) {
      return res
        .status(400)
        .json({ error: "User is already a management member." });
    }

    // Add new management member
    page.managementMembers.push({
      userName,
      designation,
      designationText: designationText || designation,
    });
    await page.save();

    return res.status(201).json({
      message: "Management member added successfully.",
      page,
    });
  } catch (error) {
    console.error("addManagementMember Error:", error);
    return res
      .status(500)
      .json({ error: "Server error adding management member." });
  }
};

/**
 * PATCH /api/executive-management/items/:memberId
 * Admin-only endpoint: Update an existing management member.
 * Expected JSON body: any of { userName, designation, designationText }
 */
exports.updateManagementMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { userName, designation, designationText } = req.body;

    let page = await ExecutiveManagementTeamPage.findOne();
    if (!page) {
      return res
        .status(404)
        .json({ error: "Executive management page not found." });
    }
    const member = page.managementMembers.id(memberId);
    if (!member) {
      return res.status(404).json({ error: "Management member not found." });
    }
    if (userName !== undefined) member.userName = userName;
    if (designation !== undefined) member.designation = designation;
    if (designationText !== undefined) member.designationText = designationText;
    await page.save();

    return res.status(200).json({
      message: "Management member updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateManagementMember Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating management member." });
  }
};

/**
 * DELETE /api/executive-management/items/:memberId
 * Admin-only endpoint: Delete a management member.
 */
exports.deleteManagementMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    let page = await ExecutiveManagementTeamPage.findOne();
    if (!page) {
      return res
        .status(404)
        .json({ error: "Executive management page not found." });
    }
    const member = page.managementMembers.id(memberId);
    if (!member) {
      return res.status(404).json({ error: "Management member not found." });
    }
    page.managementMembers.pull(memberId);
    await page.save();

    return res.status(200).json({
      message: "Management member deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteManagementMember Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting management member." });
  }
};
