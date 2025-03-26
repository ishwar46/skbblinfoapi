const mongoose = require("mongoose");

const scholarshipRecipientSchema = new mongoose.Schema({
  contributorName: { type: String, default: "" },
  studentName: { type: String, required: true },
  recipientImage: { type: String, default: "" },
  grade: { type: Number, default: "" },
  address: { type: String, default: "" },
  father: { type: String, default: "" },
  mother: { type: String, default: "" },
  contact: { type: String, default: "" },
  familySize: { type: Number },
  schoolNameAndAddress: { type: String, default: "" },
  schoolContactPerson: { type: String, default: "" },
  schoolContactNumber: { type: String, default: "" },
  firstInstallment: { type: String, default: "" },
  classPosition: { type: String, default: "" },
  remarks: { type: String, default: "" },
  // If the contributor is a registered user, store a reference:
  contributor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // manually provide a contributor name:
});

const scholarshipRecipientsPageSchema = new mongoose.Schema(
  {
    pageTitle: {
      type: String,
      required: true,
      default: "Scholarship Recipients",
    },
    pageDescription: { type: String, default: "" },
    recipients: [scholarshipRecipientSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ScholarshipRecipientsPage",
  scholarshipRecipientsPageSchema
);
