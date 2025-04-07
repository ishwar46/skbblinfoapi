// controllers/uploadController.js
const createUploader = require("../middleware/uploader");
const User = require("../models/User");
const getNextReceiptNumber = require("../utils/getNextReceiptNumber");

/**
 * Upload Profile Picture
 * POST /api/uploads/profile-picture
 * Form field name: "profilePicture"
 */

exports.uploadProfilePicture = [
  // Multer middleware
  (req, res, next) => {
    const uploader = createUploader("profilePictures").single("profilePicture");
    uploader(req, res, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  // Controller logic
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      // userId from authMiddleware
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Save file path to user document
      user.profilePicture = req.fileRelativePath;
      await user.save();

      return res.status(200).json({
        message: "Profile picture added successfully.",
        profilePicture: user.profilePicture,
      });
    } catch (error) {
      console.error("uploadProfilePicture Error:", error);
      return res.status(500).json({
        error: "Server error while uploading profile picture.",
      });
    }
  },
];

/**
 * Upload a Receipt
 * POST /api/uploads/receipt
 * Form field name: "receipt"
 */

exports.uploadReceipt = [
  (req, res, next) => {
    const uploader = createUploader("receipts").single("receipt");
    uploader(req, res, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      const Counter = (await getNextReceiptNumber())
        .toString()
        .padStart(4, "0");

      user.receipts.push({
        receiptNumber: "#JHA-" + Counter,
        fileName: req.file.filename,
        filePath: req.fileRelativePath,
        uploadedAt: new Date(),
      });

      await user.save();

      return res.status(200).json({
        message: "Receipt uploaded successfully.",
        receipts: user.receipts,
      });
    } catch (error) {
      console.error("uploadReceipt Error:", error);
      return res.status(500).json({
        error: "Server error while uploading receipt.",
      });
    }
  },
];

exports.uploadReceiptDuringRegister = [
  (req, res, next) => {
    const uploader =
      createUploader("membership-receipt").single("membership-receipt");

    uploader(req, res, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    const { userId } = req.body;
    console.log(req.body);
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      user.membershipReceipt = {
        fileName: req.file.filename,
        filePath: req.fileRelativePath,
        uploadedAt: new Date(),
      };
      user.accountStatus = "pendingVerification";

      await user.save();

      return res.status(200).json({
        message: "Receipt uploaded successfully.",
        membershipReceipt: user.membershipReceipt,
      });
    } catch (error) {
      console.error("uploadReceipt Error:", error);
      return res.status(500).json({
        error: "Server error while uploading receipt.",
      });
    }
  },
];
