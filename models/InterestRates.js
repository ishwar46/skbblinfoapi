const mongoose = require("mongoose");

const interestRatesSchema = new mongoose.Schema(
  {
    pageTitle: { type: String, default: "Interest Rates" },
    interestImage: { type: String, default: "" },
  },

  { timestamps: true }
);

module.exports = mongoose.model("InterestRates", interestRatesSchema);
