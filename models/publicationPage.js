const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  category: { type: String, required: true },
  postedDate: { type: Date, default: Date.now },
});

const publicationPageSchema = new mongoose.Schema(
  {
    categories: [{ type: String, required: true, unique: true }],
    documents: [publicationSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("PublicationPage", publicationPageSchema);
