const HearseVehiclePage = require("../models/hearseVehiclePage");

/**
 * GET /api/hearse-vehicles
 * Public endpoint: Retrieve the Hearse Vehicle Contributions page,
 * including page-level info and all contributions.
 */
exports.getHearseVehiclePage = async (req, res) => {
  try {
    let page = await HearseVehiclePage.findOne().populate(
      "contributions.contributor",
      "fullName email profilePicture"
    );
    if (!page) {
      page = new HearseVehiclePage();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getHearseVehiclePage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching hearse vehicle page." });
  }
};

/**
 * PUT /api/hearse-vehicles
 * Admin-only endpoint: Update the page-level info (pageTitle and pageDescription).
 * Expected JSON body: { pageTitle, pageDescription }
 */
exports.updateHearseVehiclePage = async (req, res) => {
  try {
    const { pageTitle, pageDescription } = req.body;
    let page = await HearseVehiclePage.findOne();
    if (!page) {
      page = new HearseVehiclePage();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    if (pageDescription !== undefined) page.pageDescription = pageDescription;
    await page.save();
    return res.status(200).json({
      message: "Hearse vehicle page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateHearseVehiclePage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating hearse vehicle page." });
  }
};

/**
 * POST /api/hearse-vehicles/items
 * Admin-only endpoint: Add a new contribution.
 * Expected JSON body:
 * {
 *   "contributor": "userId",
 *   "donatedAmount": 500,
 *   "donatedDate": "2025-02-08T12:00:00.000Z",
 *   "note": "Generous contribution"
 * }
 */
exports.addContribution = async (req, res) => {
  try {
    const { contributor, donatedAmount, donatedDate, note } = req.body;
    if (!contributor || !donatedAmount || !donatedDate) {
      return res
        .status(400)
        .json({
          error: "Contributor, donatedAmount, and donatedDate are required.",
        });
    }
    let page = await HearseVehiclePage.findOne();
    if (!page) {
      page = new HearseVehiclePage();
      await page.save();
    }
    page.contributions.push({
      contributor,
      donatedAmount,
      donatedDate,
      note: note || "",
    });
    await page.save();
    page = await HearseVehiclePage.findOne().populate(
      "contributions.contributor",
      "fullName email"
    );
    return res.status(201).json({
      message: "Contribution added successfully.",
      page,
    });
  } catch (error) {
    console.error("addContribution Error:", error);
    return res.status(500).json({ error: "Server error adding contribution." });
  }
};

/**
 * PATCH /api/hearse-vehicles/items/:contributionId
 * Admin-only endpoint: Update an existing contribution.
 * Expected JSON body: any of { contributor, donatedAmount, donatedDate, note }
 */
exports.updateContribution = async (req, res) => {
  try {
    const { contributionId } = req.params;
    const { contributor, donatedAmount, donatedDate, note } = req.body;
    let page = await HearseVehiclePage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Hearse vehicle page not found." });
    }
    const contribution = page.contributions.id(contributionId);
    if (!contribution) {
      return res.status(404).json({ error: "Contribution not found." });
    }
    if (contributor !== undefined) contribution.contributor = contributor;
    if (donatedAmount !== undefined) contribution.donatedAmount = donatedAmount;
    if (donatedDate !== undefined) contribution.donatedDate = donatedDate;
    if (note !== undefined) contribution.note = note;
    await page.save();
    page = await HearseVehiclePage.findOne().populate(
      "contributions.contributor",
      "fullName email"
    );
    return res.status(200).json({
      message: "Contribution updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateContribution Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating contribution." });
  }
};

/**
 * DELETE /api/hearse-vehicles/items/:contributionId
 * Admin-only endpoint: Delete a contribution.
 */
exports.deleteContribution = async (req, res) => {
  try {
    const { contributionId } = req.params;
    let page = await HearseVehiclePage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Hearse vehicle page not found." });
    }
    const contribution = page.contributions.id(contributionId);
    if (!contribution) {
      return res.status(404).json({ error: "Contribution not found." });
    }
    page.contributions.pull(contributionId);
    await page.save();
    page = await HearseVehiclePage.findOne().populate(
      "contributions.contributor",
      "fullName email"
    );
    return res.status(200).json({
      message: "Contribution deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteContribution Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting contribution." });
  }
};
