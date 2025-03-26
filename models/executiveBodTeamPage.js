const mongoose = require("mongoose");

const bodMemberSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    designationText: {
      type: String,
      required: true,
    },
    //Define hierarchy for sorting lower is better
    Hierarchy: {
      type: Number,
      required: false,
    },
  },
  { _id: true }
);

const bodTeamPageSchema = new mongoose.Schema(
  {
    pageTitle: {
      type: String,
      required: true,
      default: "National Executive Committee",
    },
    bodMembers: [bodMemberSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExecutiveBodTeamPage", bodTeamPageSchema);
