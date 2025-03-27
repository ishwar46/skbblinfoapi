const OrgSummary = require("../models/orgSummary");

/**
 * GET /api/orgSummary
 * Public: Returns the OrgSummary document (title, description, buttonText )
 */
exports.getOrgSummary = async (req, res) => {
  try {
    let page = await OrgSummary.findOne();
    if (!page) {
      page = new OrgSummary();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getOrgSummary Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching org summary." });
  }
};

/**
 * POST /api/orgSummary
 * Admin Only: Update page-level info (title, description, buttonText )
 */
exports.updateOrgSummaryPage = async (req, res) => {
  try {
    const { title, description, buttonText } = req.body;
    let page = await OrgSummary.findOne();
    if (!page) {
      page = new OrgSummary();
    }
    if (title !== undefined) page.title = title;
    if (description !== undefined) page.description = description;
    if (buttonText !== undefined) page.buttonText = buttonText;
    await page.save();
    return res.status(200).json({
      message: "Org Summary updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateBranchPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating org summary." });
  }
};
