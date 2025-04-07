const ScholarshipPage = require("../models/scholarshipPage");
const createUploader = require("../middleware/uploader");

// Create an uploader for the scholarship page (QR codes will be stored under /uploads/scholarship)

// Multer instance for qr images
const donationUploader = createUploader("donationQR").single("qrImage");

// Middleware wrapper for file uploads
exports.uploadDonationImageMiddleware = (req, res, next) => {
  donationUploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// Middleware to handle multiple QR code file uploads.
const scholarshipUploader = createUploader("scholarship");

// Middleware to handle multiple QR code file uploads.
exports.uploadScholarshipQRMiddleware = (req, res, next) => {
  const upload = scholarshipUploader.fields([
    { name: "donationZelleQR", maxCount: 1 },
    { name: "donationPaypalQR", maxCount: 1 },
    { name: "donationEsewaQR", maxCount: 1 },
    { name: "donationKhaltiQR", maxCount: 1 },
    { name: "donationBankQR", maxCount: 1 },
  ]);
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/scholarships
 * Retrieve the Scholarship page details.
 */
exports.getScholarshipPage = async (req, res) => {
  try {
    let page = await ScholarshipPage.findOne();
    if (!page) {
      // If no document exists, create one with default values.
      page = new ScholarshipPage();
      await page.save();
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("getScholarshipPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching scholarship page." });
  }
};

/**
 * PUT /api/scholarships
 * Admin-only endpoint: Update the Scholarship page details,
 * including text fields and QR code images.
 * Accepts multipart/form-data.
 * For text fields, use JSON string or normal form-data fields.
 */

exports.addDonationOther = async (req, res) => {
  try {
    const { instructions, donationType } = req.body;

    // Ensure the document exists
    let page = await ScholarshipPage.findOne();
    if (!page) {
      page = new ScholarshipPage();
      await page.save();
    }

    // Process uploaded images (supports multiple images)
    let qrImageName = "";
    if (req.file) {
      qrImageName = req.file.filename;
    }

    page.donationOthers.push({
      // Unique ID for each donation
      instructions: instructions || "",
      qrImage: qrImageName,
      donationType: donationType || "",
    });

    await page.save();

    return res.status(201).json({
      message: "Donation method added successfully.",
      page,
    });
  } catch (error) {
    console.error("addDonationOther Error:", error);
    return res.status(500).json({ error: "Server error adding donation." });
  }
};

/**
 * DELETE /api/scholarships/add-donation-methods/:itemId
 * Admin only: remove a donation method from the array by ID
 */
exports.deleteDonationItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    let page = await ScholarshipPage.findOne();
    if (!page) {
      return res.status(404).json({ error: "Programs page not found." });
    }

    const scholarshipItem = page.donationOthers.id(itemId);
    if (!scholarshipItem) {
      return res.status(404).json({ error: "Program item not found." });
    }

    page.donationOthers.pull(itemId);

    await page.save();

    return res.status(200).json({
      message: "Donation method deleted successfully.",
      page,
    });
  } catch (error) {
    console.error("deleteProgramItem Error:", error);
    return res
      .status(500)
      .json({ error: "Server error deleting donation method." });
  }
};

exports.updateScholarshipPage = async (req, res) => {
  try {
    const {
      pageTitle,
      pageDescription,
      donationZelle,
      donationPaypal,
      donationEsewa,
      donationKhalti,
      donationBank,
      donationOthers,
    } = req.body;

    let page = await ScholarshipPage.findOne();
    if (!page) {
      page = new ScholarshipPage();
    }

    if (pageTitle !== undefined) page.pageTitle = pageTitle;
    if (pageDescription !== undefined) page.pageDescription = pageDescription;

    if (donationZelle !== undefined) {
      const parsedDonationZelle =
        typeof donationZelle === "string"
          ? JSON.parse(donationZelle)
          : donationZelle;
      page.donationZelle = {
        instructions:
          parsedDonationZelle.instructions || page.donationZelle.instructions,
        email: parsedDonationZelle.email || page.donationZelle.email,
        method: parsedDonationZelle.method || page.donationZelle.method,
        qrImage: page.donationZelle.qrImage,
      };
    }
    if (donationZelle !== undefined) {
      const parsedDonationZelle =
        typeof donationZelle === "string"
          ? JSON.parse(donationZelle)
          : donationZelle;
      page.donationZelle = {
        instructions:
          parsedDonationZelle.instructions || page.donationZelle.instructions,
        email: parsedDonationZelle.email || page.donationZelle.email,
        method: parsedDonationZelle.method || page.donationZelle.method,
        qrImage: page.donationZelle.qrImage,
      };
    }
    if (donationPaypal !== undefined) {
      const parsedDonationPaypal =
        typeof donationPaypal === "string"
          ? JSON.parse(donationPaypal)
          : donationPaypal;
      page.donationPaypal = {
        instructions:
          parsedDonationPaypal.instructions || page.donationPaypal.instructions,
        fee: parsedDonationPaypal.fee || page.donationPaypal.fee,
        note: parsedDonationPaypal.note || page.donationPaypal.note,
        link: parsedDonationPaypal.link || page.donationPaypal.link,
        qrImage: page.donationPaypal.qrImage,
      };
    }
    if (donationEsewa !== undefined) {
      const parsedDonationEsewa =
        typeof donationEsewa === "string"
          ? JSON.parse(donationEsewa)
          : donationEsewa;
      page.donationEsewa = {
        instructions:
          parsedDonationEsewa.instructions || page.donationEsewa.instructions,
        name: parsedDonationEsewa.name || page.donationEsewa.name,
        number: parsedDonationEsewa.number || page.donationEsewa.number,
        qrImage: page.donationEsewa.qrImage,
      };
    }
    if (donationKhalti !== undefined) {
      const parsedDonationKhalti =
        typeof donationKhalti === "string"
          ? JSON.parse(donationKhalti)
          : donationKhalti;
      page.donationKhalti = {
        instructions:
          parsedDonationKhalti.instructions || page.donationKhalti.instructions,
        name: parsedDonationKhalti.name || page.donationKhalti.name,
        number: parsedDonationKhalti.number || page.donationKhalti.number,
        qrImage: page.donationKhalti.qrImage,
      };
    }
    if (donationBank !== undefined) {
      const parsedDonationBank =
        typeof donationBank === "string"
          ? JSON.parse(donationBank)
          : donationBank;
      page.donationBank = {
        instructions:
          parsedDonationBank.instructions || page.donationBank.instructions,
        accountName:
          parsedDonationBank.accountName || page.donationBank.accountName,
        accountNumber:
          parsedDonationBank.accountNumber || page.donationBank.accountNumber,
        qrImage: page.donationKhalti.qrImage,
      };
    }
    if (donationOthers !== undefined) {
      const parseDonationOthers =
        typeof donationOthers === "string"
          ? JSON.parse(donationOthers)
          : donationOthers;
      page.donationOthers = {
        instructions:
          parseDonationOthers.instructions || page.donationOthers.instructions,
        qrImage: page.donationOthers.qrImage,
        donationType:
          parseDonationOthers.donationType || page.donationOthers.donationType,
      };
    }

    // Process uploaded files (if any)
    if (req.files) {
      if (req.files.donationZelleQR && req.files.donationZelleQR[0]) {
        page.donationZelle.qrImage = req.files.donationZelleQR[0].filename;
      }
      if (req.files.donationPaypalQR && req.files.donationPaypalQR[0]) {
        page.donationPaypal.qrImage = req.files.donationPaypalQR[0].filename;
      }
      if (req.files.donationEsewaQR && req.files.donationEsewaQR[0]) {
        page.donationEsewa.qrImage = req.files.donationEsewaQR[0].filename;
      }
      if (req.files.donationKhaltiQR && req.files.donationKhaltiQR[0]) {
        page.donationKhalti.qrImage = req.files.donationKhaltiQR[0].filename;
      }
      if (req.files.donationBankQR && req.files.donationBankQR[0]) {
        page.donationBank.qrImage = req.files.donationBankQR[0].filename;
      }
    }

    await page.save();
    return res.status(200).json({
      message: "Scholarship page updated successfully.",
      page,
    });
  } catch (error) {
    console.error("updateScholarshipPage Error:", error);
    return res
      .status(500)
      .json({ error: "Server error updating scholarship page." });
  }
};
