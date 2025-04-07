const mongoose = require('mongoose')

const texasMemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    designation: {
        type: String,
        required: true
    },

},
    {
        _id: true
    });

const texasChapterPageSchema = new mongoose.Schema(
    {
        pageTitle: {
            type: String,
            required: true,
            default: "Texas Chapter Committee"
        },

        pageDescription: {
            type: String,
            default: "Meet our Texas Chapter leadership team."
        },
        members: [texasMemberSchema]
    },
    { timestamps: true }
);

module.exports = mongoose.model("TexasChapterPage", texasChapterPageSchema);

