const mongoose = require("mongoose");

const productAndServicesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  descriptionParagraph: [{ type: String, required: true }],
  programThumbnail: { type: String, default: "" },
  programType: { type: String, enum: ["Loan", "Service"], required: true },
  programImages: [{ type: String, default: "" }],
});

const productAndServicePage = new mongoose.Schema(
  {
    productAndServices: [productAndServicesSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productAndServicePage);
