const ExecutiveBodTeamPage = require("../models/executiveBodTeamPage");

const roleHierarchy = {
  Chairman: 1,
  Member: 2,
  "Company Secretary": 3,
  "Sr. Manager": 4,
};

/**
 * GET /api/executive-bod
 * Public endpoint to retrieve the Executive Bod page details,
 * including populated bod member information, sorted by hierarchy.
 */
exports.getExecutiveBodPage = async (req, res) => {
  try {
    let page = await ExecutiveBodTeamPage.findOne();
    if (!page) {
      // Create a default page if it doesn't exist
      page = new ExecutiveBodTeamPage({
        pageTitle: "Board of Directors",
      });
      await page.save();
    }

    // Sort bod members based on role hierarchy
    page.bodMembers.sort((a, b) => {
      return (
        (roleHierarchy[a.designation] || 99) -
        (roleHierarchy[b.designation] || 99)
      );
    });

    return res.status(200).json(page);
  } catch (error) {
    console.error("ExecutiveBodTeamPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching executive bod page." });
  }
};

/**
 * PUT /api/executive-bod
 * Admin-only endpoint: Update the page-level information.
 * Expected JSON body: { pageTitle }
 */
exports.updateExecutiveBodPage = async (req, res) => {
  try {
    const { pageTitle } = req.body;
    let page = await ExecutiveBodTeamPage.findOne();
    if (!page) {
      page = new ExecutiveBodTeamPage();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    await page.save();
    return res.status(200).json({
      message: "Executive bod page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateExecutiveBodPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating executive bod page." });
  }
};

/**
 * POST /api/executive-bod/items
 * Admin-only endpoint: Add a new bod member.
 * Expected JSON body:
 * {
 *   "userName": "FistName LastName",
 *   "designation": "President"
 *   "designationText": "I am the president"
 * }
 */
exports.addBodMember = async (req, res) => {
  try {
    const { userName, designation, designationText } = req.body;
    if (!userName || !designation) {
      return res
        .status(400)
        .json({ error: "Username and designation are required." });
    }

    let page = await ExecutiveBodTeamPage.findOne();
    if (!page) {
      page = new ExecutiveBodTeamPage();
      await page.save();
    }

    // Check if the userName already exists in bodMembers
    const isAlreadyMember = page.bodMembers.some(
      (member) => member.userName.toString() === userName
    );
    if (isAlreadyMember) {
      return res.status(400).json({ error: "User is already a bod member." });
    }

    // Add new bod member
    page.bodMembers.push({
      userName,
      designation,
      designationText: designationText || designation,
    });

    await page.save();

    return res.status(201).json({
      message: "Bod member added successfully.",
      page,
    });
  } catch (error) {
    console.error("addBodMember Error:", error);
    return res.status(500).json({ error: "Server error adding bod member." });
  }
};

/**
 * PATCH /api/executive-bod/items/:memberId
 * Admin-only endpoint: Update an existing bod member.
 * Expected JSON body: any of { userName, designation, designationText }
 */
exports.updateBodMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { userName, designation, designationText } = req.body;

    let page = await ExecutiveBodTeamPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Executive bod page not found." });
    }
    const member = page.bodMembers.id(memberId);
    if (!member) {
      return res.status(404).json({ error: "Bod member not found." });
    }
    if (userName !== undefined) member.userName = userName;
    if (designation !== undefined) member.designation = designation;
    if (designationText !== undefined) member.designationText = designationText;
    await page.save();
    return res.status(200).json({
      message: "Bod member updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateBodMember Error:", error);
    return res.status(500).json({ error: "Server error updating bod member." });
  }
};

/**
 * DELETE /api/executive-bod/items/:memberId
 * Admin-only endpoint: Delete a bod member.
 */
exports.deleteBodMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    let page = await ExecutiveBodTeamPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Executive bod page not found." });
    }
    const member = page.bodMembers.id(memberId);
    if (!member) {
      return res.status(404).json({ error: "Bod member not found." });
    }
    page.bodMembers.pull(memberId);
    await page.save();
    return res.status(200).json({
      message: "Bod member deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteBodMember Error:", error);
    return res.status(500).json({ error: "Server error deleting bod member." });
  }
};
