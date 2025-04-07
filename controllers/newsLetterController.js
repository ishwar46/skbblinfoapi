const NewsLetter = require("../models/NewsLetter");
/**
 * GET /api/news-letter
 * Public - Fetch the mission and story content
 */
exports.getNewsletter = async (req, res) => {
  try {
    let page = await NewsLetter.findOne();
    if (!page) {
      page = new NewsLetter();
      await page.save();
    }

    return res.status(200).json(page);
  } catch (error) {
    console.error("getNewsLetter Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching news letter." });
  }
};
/**
 * POST /api/news-letter
 * Add Data to NewsLetter
 */
exports.addNewEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const existingEmail = await NewsLetter.findOne({ emails: email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists." });
    }

    let page = await NewsLetter.findOne();
    if (!page) {
      page = new NewsLetter({ emails: [email] });
    } else {
      page.emails.push(email);
    }

    await page.save();
    return res.status(201).json({
      message: "Thank you for subscribing to our newsletter.",
      email,
    });
  } catch (error) {
    console.error("addNewsletter Error:", error);
    return res
      .status(500)
      .json({ error: "Server error adding user to newsletter." });
  }
};
