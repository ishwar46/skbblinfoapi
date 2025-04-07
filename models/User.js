const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  profession: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  relationship: { type: String, trim: true },
});

const spouseSchema = new mongoose.Schema({
  fullName: { type: String, trim: true },
  profession: { type: String, trim: true },
  contact: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
});

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    contact: { type: String, trim: true },
    profession: { type: String, trim: true },
    password: { type: String, required: true },

    profilePicture: {
      type: String,
      default: "",
      trim: true,
    },

    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    canReceiveText: { type: Boolean, default: false },
    hasSpouse: { type: Boolean, default: false },
    spouse: { type: spouseSchema, default: null },
    familyMembers: [familyMemberSchema],
    membershipType: {
      type: String,
      enum: ["general", "patron", "associate", "supporter"],
      default: "general",
      required: true,
    },
    membershipFee: { type: Number, default: 0 },
    membershipPaid: { type: Boolean, default: false },
    membershipPaidAt: { type: Date, default: null },

    donatedAmount: { type: Number, default: 0 },
    receipts: [
      {
        receiptNumber: { type: String, unique: true },
        fileName: String,
        filePath: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    membershipReceipt: {
      fileName: String,
      filePath: String,
      uploadedAt: { type: Date, default: Date.now },
    },
    statusReason: { type: String },

    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    accountLocked: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    loginLogs: [
      {
        timestamp: { type: Date, default: Date.now },
        ip: String,
        userAgent: String,
      },
    ],
    accountStatus: {
      type: String,
      enum: [
        "pending",
        "active",
        "deactivated",
        "rejected",
        "pendingVerification",
      ],
      default: "pending",
    },
    accountExpiry: { type: Date, default: null },

    /**
     * Role:
     * - 'user': normal user
     * - 'admin': has admin privileges
     * - 'superadmin': can promote other users to admin, etc.
     */
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
