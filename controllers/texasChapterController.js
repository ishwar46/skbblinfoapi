const TexasChapterPage = require("../models/texasChapterPage");

/**
 * GET /api/texas-chapter
 * Public endpoint: Retrieve the Texas Chapter Committee page with populated member details.
 */

exports.getTexasChapterPage = async (req, res) => {
    try {
        let page = await TexasChapterPage.findOne().populate("members.user", "fullName profilePicture email");
        if (!page) {
            //Create a deafault page with title and page desc
            page = new TexasChapterPage({
                pageTitle: "Texas Chapter Comittee",
                pageDescription: "Meet our Texas Chapter leadership team."
            });
            await page.save();
            page = await TexasChapterPage.findOne().populate("members.user", "fullName profilePicture email")
        }
        return res.status(200).json(page);
    } catch (error) {
        console.error("getTexasChapterPage Error:", error);
        return res.status(500).json({ error: "Server error fetching Texas Chapter page." })
    }
};

/**
 * PUT /api/texas-chapter
 * Admin-only endpoint: Update the page-level info (pageTitle, pageDescription).
 * Expected JSON body: { pageTitle, pageDescription }
 */

exports.updateTexasChapterPage = async (req, res) => {
    try {
        const { pageTitle, pageDescription } = req.body;
        let page = await TexasChapterPage.findOne();
        if (!page) {
            page = new TexasChapterPage();
        }
        if (pageTitle !== undefined) page.pageTitle = pageTitle;
        if (pageDescription !== undefined) page.pageDescription = pageDescription;
        await page.save();
        return res.status(200).json({
            message: "Texas Chapter page updated successfully.",
            page,
        });
    }
    catch (error) {
        console.error("updateTexasChapterPage Error:", error);
        return res.status(500).json({ error: "Server error updating Texas Chapter page." })
    }
};

/**
 * POST /api/texas-chapter/members
 * Admin-only endpoint: Add a new committee member.
 * Expected JSON body: { user: "<User ObjectId>", designation: "Role" }
 */
exports.addTexasMember = async (req, res) => {
    try {
        const { user, designation } = req.body;
        if (!user || !designation) {
            return res.status(400).json({ error: "User and designation are required." });
        }
        let page = await TexasChapterPage.findOne();
        if (!page) {
            page = new TexasChapterPage();
            await page.save();
        }
        page.members.push({ user, designation });
        await page.save();
        // Populate the user info for response
        page = await TexasChapterPage.findOne().populate("members.user", "fullName profilePicture email");
        return res.status(201).json({
            message: "Texas Chapter member added successfully.",
            page,
        });
    } catch (error) {
        console.error("addTexasMember Error:", error);
        return res.status(500).json({ error: "Server error adding Texas Chapter member." });
    }
};

/**
 * PATCH /api/texas-chapter/members/:memberId
 * Admin-only endpoint: Update an existing committee member.
 * Expected JSON body: { user, designation } (one or both)
 */
exports.updateTexasMember = async (req, res) => {
    try {
        const { memberId } = req.params;
        const { user, designation } = req.body;
        let page = await TexasChapterPage.findOne();
        if (!page) {
            return res.status(404).json({ error: "Texas Chapter page not found." });
        }
        const member = page.members.id(memberId);
        if (!member) {
            return res.status(404).json({ error: "Committee member not found." });
        }
        if (user !== undefined) member.user = user;
        if (designation !== undefined) member.designation = designation;
        await page.save();
        page = await TexasChapterPage.findOne().populate("members.user", "fullName profilePicture email");
        return res.status(200).json({
            message: "Texas Chapter member updated successfully.",
            page,
        });
    } catch (error) {
        console.error("updateTexasMember Error:", error);
        return res.status(500).json({ error: "Server error updating Texas Chapter member." });
    }
};

/**
 * DELETE /api/texas-chapter/members/:memberId
 * Admin-only endpoint: Delete a committee member.
 */
exports.deleteTexasMember = async (req, res) => {
    try {
        const { memberId } = req.params;
        let page = await TexasChapterPage.findOne();
        if (!page) {
            return res.status(404).json({ error: "Texas Chapter page not found." });
        }
        const member = page.members.id(memberId);
        if (!member) {
            return res.status(404).json({ error: "Member not found." });
        }
        page.members.pull(memberId);
        await page.save();
        page = await TexasChapterPage.findOne().populate("members.user", "fullName profilePicture email");
        return res.status(200).json({
            message: "Texas Chapter member deleted successfully.",
            page,
        });
    } catch (error) {
        console.error("deleteTexasMember Error:", error);
        return res.status(500).json({ error: "Server error deleting Texas Chapter member." });
    }
};