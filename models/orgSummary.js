const mongoose = require("mongoose");

const orgSummarySchema = new mongoose.Schema({
  title: { type: String, default: "Welcome to SKBBL" },
  description: {
    type: String,
    default:
      "Sana Kisan Bikas Laghubitta Bittiyasanstha Ltd. (SKBBL) formerly known as Sana Kisan Bikas Bank Ltd. was established on July 6, 2001 under the Companies Act, 2053 (1997). Later, with the Execution of Bank and financial Institution Act, 2073, the bank was renamed as Sana Kisan Bikas Laghubitta Bittiyasanstha Ltd. (SKBBL). After Merger of two esteemed wholesale lending Microfinance Institution namely RMDC.",
  },
  buttonText: { type: String, default: "Read More" },
});

module.exports = mongoose.model("OrgSummary", orgSummarySchema);
