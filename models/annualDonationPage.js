const mongoose = require("mongoose");

const donationEntrySchema = new mongoose.Schema({
    contributor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    donatedAmount: { type: Number, required: true },
    donatedDate: { type: Date, required: true },
    note: { type: String, default: "" }
});

const annualDonationPageSchema = new mongoose.Schema(
    {
        pageTitle: {
            type: String,
            required: true,
            default: "Annual Donations"
        },
        pageDescription: { type: String, default: "" },
        donations: [donationEntrySchema]
    },
    { timestamps: true }
);

// Virtual property to calculate total donated amount
annualDonationPageSchema.virtual("totalDonated").get(function () {
    return this.donations.reduce((sum, donation) => sum + donation.donatedAmount, 0);
});

// Ensure virtual fields are included when converting to JSON or Object
annualDonationPageSchema.set("toJSON", { virtuals: true });
annualDonationPageSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("AnnualDonationPage", annualDonationPageSchema);
