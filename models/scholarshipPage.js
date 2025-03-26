const mongoose = require("mongoose");

const scholarshipPageSchema = new mongoose.Schema(
  {
    pageTitle: {
      type: String,
      required: true,
      default: "Our Scholarship Program",
    },
    pageDescription: { type: String, default: "" },

    // Donation by Check
    donationCheck: {
      instructions: {
        type: String,
        default:
          "Send your annual Child Sponsor Scholarship Donation check to:",
      },
      annualDonation: { type: Number, default: 200.0 },
      onetimeDonation: { type: Number, default: 2200.0 },
      address: {
        type: String,
        default: "",
      },
      qrImage: { type: String, default: "" },
    },

    // Donation via Zelle
    donationZelle: {
      instructions: {
        type: String,
        default: "OR\nSend your donation to",
      },
      email: { type: String, default: "" },
      method: { type: String, default: "using Zelle." },
      qrImage: { type: String, default: "" },
    },

    // Donation via PayPal
    donationPaypal: {
      instructions: {
        type: String,
        default:
          "OR\nDonate your annual donation using the following PayPal link",
      },
      fee: { type: Number, default: 205.0 },
      note: {
        type: String,
        default: "($205.00 includes PayPal fee)",
      },
      link: { type: String, default: "" },
      qrImage: { type: String, default: "" },
    },

    // Donation via eSewa
    donationEsewa: {
      instructions: { type: String, default: "OR\nDonate via eSewa" },
      name: { type: String, default: "" },
      number: { type: String, default: "" },
      qrImage: { type: String, default: "" },
    },

    // Donation via Khalti
    donationKhalti: {
      instructions: { type: String, default: "OR\nDonate via Khalti" },
      name: { type: String, default: "" },
      number: { type: String, default: "" },
      qrImage: { type: String, default: "" },
    },

    // Donation via Bank Transfer
    donationBank: {
      instructions: { type: String, default: "OR\nDonate via Bank Transfer" },
      accountName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      qrImage: { type: String, default: "" },
    },
    donationOthers: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        instructions: { type: String },
        qrImage: { type: String, default: "" },
        donationType: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScholarshipPage", scholarshipPageSchema);
