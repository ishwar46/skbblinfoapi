/**
 * GET /api/settings
 * Public endpoint: returns the single settings doc).
 */

const Settings = require("../models/Settings");

exports.getSettings = async (req, res) => {
  try {
    // If we have exactly one doc, we can do findOne()
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    return res.status(200).json(settings);
  } catch (error) {
    console.error("getFooter Error:", error);
    return res.status(500).json({ error: "Server error fetching settings." });
  }
};

/**
 * PATCH /api/settings
 * Public endpoint: returns the single settings doc).
 */

exports.updateSettings = async (req, res) => {
  try {
    const { deleteConfirmation } = req.body;
    console.log(req.body);
    let page = await Settings.findOne();
    if (!page) page = new Settings();

    if (deleteConfirmation !== undefined)
      page.deleteConfirmation = deleteConfirmation;

    await page.save();
    return res.status(200).json({
      message: "Settings updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateFooter Error:", error);
    return res.status(500).json({ error: "Server error updating settings" });
  }
};
