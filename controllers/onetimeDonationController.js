const OneTimeDonationPage = require("../models/onetimeDonationPage");

/**
 * GET /api/onetime-donations
 * Public endpoint: Retrieve the OneTime Donations page details,
 * including the donations array and total donated amount.
 */
exports.getOneTimeDonationPage = async (req, res) => {
  try {
    let page = await OneTimeDonationPage.findOne().populate(
      "donations.contributor",
      "fullName email address profilePicture"
    );
    if (!page) {
      page = new OneTimeDonationPage();
      await page.save();
      page = await OneTimeDonationPage.findOne().populate(
        "donations.contributor",
        "fullName email address profilePicture"
      );
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getOneTimeDonationPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching onetime donation page." });
  }
};

/**
 * PUT /api/onetime-donations
 * Admin-only endpoint: Update the page-level info (pageTitle, pageDescription).
 * Expected JSON body: { pageTitle, pageDescription }
 */
exports.updateOneTimeDonationPage = async (req, res) => {
  try {
    const { pageTitle, pageDescription } = req.body;
    let page = await OneTimeDonationPage.findOne();
    if (!page) {
      page = new OneTimeDonationPage();
    }
    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    if (pageDescription !== undefined) page.pageDescription = pageDescription;
    await page.save();
    return res.status(200).json({
      message: "OneTime donation page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateOneTimeDonationPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating onetime donation page." });
  }
};

/**
 * POST /api/onetime-donations/items
 * Admin-only endpoint: Add a new donation entry.
 * Expected JSON body:
 * {
 *   "contributor": "<User ObjectId>",
 *   "donatedAmount": 500,
 *   "donatedDate": "2025-02-08T12:00:00.000Z",
 *   "note": "Generous contribution"
 * }
 */
exports.addDonationEntry = async (req, res) => {
  try {
    const { contributor, donatedAmount, donatedDate, note } = req.body;
    if (!contributor || !donatedAmount || !donatedDate) {
      return res.status(400).json({
        error: "Contributor, donatedAmount, and donatedDate are required.",
      });
    }
    let page = await OneTimeDonationPage.findOne();
    if (!page) {
      page = new OneTimeDonationPage();
      await page.save();
    }
    page.donations.push({
      contributor,
      donatedAmount,
      donatedDate,
      note: note || "",
    });
    await page.save();
    page = await OneTimeDonationPage.findOne().populate(
      "donations.contributor",
      "fullName email address profilePicture"
    );
    return res.status(201).json({
      message: "Donation entry added successfully.",
      page,
    });
  } catch (error) {
    console.error("addDonationEntry Error:", error);
    return res
      .status(500)
      .json({ error: "Server error adding donation entry." });
  }
};

/**
 * PATCH /api/onetime-donations/items/:donationId
 * Admin-only endpoint: Update an existing donation entry.
 * Expected JSON body: any of { contributor, donatedAmount, donatedDate, note }
 */
exports.updateDonationEntry = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { contributor, donatedAmount, donatedDate, note } = req.body;
    let page = await OneTimeDonationPage.findOne();
    if (!page) {
      return res
        .status(404)
        .json({ error: "OneTime donation page not found." });
    }
    const donation = page.donations.id(donationId);
    if (!donation) {
      return res.status(404).json({ error: "Donation entry not found." });
    }
    if (contributor !== undefined) donation.contributor = contributor;
    if (donatedAmount !== undefined) donation.donatedAmount = donatedAmount;
    if (donatedDate !== undefined) donation.donatedDate = donatedDate;
    if (note !== undefined) donation.note = note;
    await page.save();
    page = await OneTimeDonationPage.findOne().populate(
      "donations.contributor",
      "fullName email address profilePicture"
    );
    return res.status(200).json({
      message: "Donation entry updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateDonationEntry Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating donation entry." });
  }
};

/**
 * DELETE /api/onetime-donations/items/:donationId
 * Admin-only endpoint: Delete a donation entry.
 */
exports.deleteDonationEntry = async (req, res) => {
  try {
    const { donationId } = req.params;
    let page = await OneTimeDonationPage.findOne();
    if (!page) {
      return res
        .status(404)
        .json({ error: "OneTime donation page not found." });
    }
    const donation = page.donations.id(donationId);
    if (!donation) {
      return res.status(404).json({ error: "Donation entry not found." });
    }
    page.donations.pull(donationId);
    await page.save();
    page = await OneTimeDonationPage.findOne().populate(
      "donations.contributor",
      "fullName email address profilePicture"
    );
    return res.status(200).json({
      message: "Donation entry deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteDonationEntry Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting donation entry." });
  }
};
