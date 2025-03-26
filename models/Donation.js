const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    remarks: { type: String },
    paymentIntentId: { type: String, required: true },
    cardBrand: { type: String },
    cardLast4: { type: String },
    refunded: { type: Boolean, default: false },
    refundedAmount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", donationSchema);