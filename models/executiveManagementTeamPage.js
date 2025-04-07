const mongoose = require("mongoose");

const managementMemberSchema = new mongoose.Schema(
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

const managementTeamPageSchema = new mongoose.Schema(
  {
    pageTitle: {
      type: String,
      required: true,
      default: "National Executive Committee",
    },
    managementMembers: [managementMemberSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ExecutiveManagementTeamPage",
  managementTeamPageSchema
);
