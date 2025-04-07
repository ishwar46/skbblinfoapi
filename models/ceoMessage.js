const mongoose = require("mongoose");

const ceoMessageSchema = new mongoose.Schema(
  {
    ceoImage: { type: String },
    pageTitle: { type: String, default: "CEO Message" },
    ceoTitle: { type: String },
    paragraph: [{ type: String, required: true }],
    highlightedText: { type: String },
  },

  { timestamps: true }
);

module.exports = mongoose.model("CeoMessage", ceoMessageSchema);
