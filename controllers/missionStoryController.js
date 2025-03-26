const MissionStory = require("../models/missionStory");

/**
 * GET /api/mission-story
 * Public - Fetch the mission and story content
 */
exports.getMissionStory = async (req, res) => {
    try {
        let missionStory = await MissionStory.findOne();
        if (!missionStory) {
            missionStory = new MissionStory({
                description:
                    "We are committed to making a lasting impact in Nepal through education, healthcare, and disaster relief efforts.",
                fullContent:
                    "In 2018, a group of passionate Nepali immigrants in the U.S. came together with a shared vision to give back to their homeland...",
            });
            await missionStory.save();
        }
        return res.status(200).json(missionStory);
    } catch (error) {
        console.error("getMissionStory Error:", error);
        return res.status(500).json({ error: "Server error fetching mission story." });
    }
};

/**
 * POST /api/mission-story
 * Admin only - Create a new mission & story page (only if it doesn't exist)
 */
exports.createMissionStory = async (req, res) => {
    try {
        const { pageTitle, pageSubtitle, description, fullContent } = req.body;

        // Check if a mission story already exists
        let existingMissionStory = await MissionStory.findOne();
        if (existingMissionStory) {
            return res.status(400).json({ error: "Mission & Story page already exists." });
        }

        // Create a new mission story
        const missionStory = new MissionStory({
            pageTitle,
            pageSubtitle,
            description,
            fullContent,
        });

        await missionStory.save();
        return res.status(201).json({
            message: "Mission & Story page created successfully.",
            missionStory,
        });
    } catch (error) {
        console.error("createMissionStory Error:", error);
        return res.status(500).json({ error: "Server error creating mission story." });
    }
};

/**
 * PUT /api/mission-story
 * Admin only - Update the mission and story page content
 */
exports.updateMissionStory = async (req, res) => {
    try {
        const { pageTitle, pageSubtitle, description, fullContent } = req.body;
        let missionStory = await MissionStory.findOne();

        if (!missionStory) {
            missionStory = new MissionStory();
        }

        if (pageTitle !== undefined) missionStory.pageTitle = pageTitle;
        if (pageSubtitle !== undefined) missionStory.pageSubtitle = pageSubtitle;
        if (description !== undefined) missionStory.description = description;
        if (fullContent !== undefined) missionStory.fullContent = fullContent;

        await missionStory.save();
        return res.status(200).json({
            message: "Mission story updated successfully.",
            missionStory,
        });
    } catch (error) {
        console.error("updateMissionStory Error:", error);
        return res.status(500).json({ error: "Server error updating mission story." });
    }
};

/**
 * POST /api/mission-story/videos
 * Admin only - Add a new YouTube video
 */
exports.addYoutubeVideo = async (req, res) => {
    try {
        const { title, videoId } = req.body;
        let missionStory = await MissionStory.findOne();

        if (!missionStory) {
            missionStory = new MissionStory();
        }

        if (!title || !videoId) {
            return res.status(400).json({ error: "Title and videoId are required." });
        }

        missionStory.youtubeVideos.push({ title, videoId });
        await missionStory.save();

        return res.status(201).json({
            message: "YouTube video added successfully.",
            missionStory,
        });
    } catch (error) {
        console.error("addYoutubeVideo Error:", error);
        return res.status(500).json({ error: "Server error adding YouTube video." });
    }
};

/**
 * DELETE /api/mission-story/videos/:videoId
 * Admin only - Remove a YouTube video
 */
exports.deleteYoutubeVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        let missionStory = await MissionStory.findOne();

        if (!missionStory) {
            return res.status(404).json({ error: "Mission story not found." });
        }

        missionStory.youtubeVideos = missionStory.youtubeVideos.filter(
            (video) => video.videoId !== videoId
        );

        await missionStory.save();
        return res.status(200).json({
            message: "YouTube video removed successfully.",
            missionStory,
        });
    } catch (error) {
        console.error("deleteYoutubeVideo Error:", error);
        return res.status(500).json({ error: "Server error removing video." });
    }
};
