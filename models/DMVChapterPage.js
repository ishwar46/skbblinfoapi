const mongoose = require('mongoose');

const dmvMemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    designation: {
        type: String,
        required: true
    },
}, { _id: true });

const dmvChapterPageSchema = new mongoose.Schema(
    {
        pageTitle: {
            type: String,
            required: true,
            default: "Washington DC, Virginia & Maryland Chapter"
        },
        pageDescription: {
            type: String,
            default: "Meet our DMV Chapter members who lead our regional initiatives."
        },
        members: [dmvMemberSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("DMVChapterPage", dmvChapterPageSchema);
