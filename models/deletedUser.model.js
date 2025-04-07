const mongoose = require('mongoose');

const deletedUserSchema = new mongoose.Schema(
    {
        originalUserId: { type: mongoose.Schema.Types.ObjectId, index: true },
        fullName: String,
        username: String,
        email: String,
        address: String,
        contact: String,
        profession: String,
        membershipType: String,
        membershipFee: Number,
        membershipPaid: Boolean,
        donatedAmount: Number,
        accountExpiry: Date,
        role: String,

        // Who performed the deletion
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        // Timestamp of deletion
        deletedAt: {
            type: Date,
            default: Date.now,
        },
        // reason or comment
        reason: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('DeletedUser', deletedUserSchema);
