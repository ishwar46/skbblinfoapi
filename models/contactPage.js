const mongoose = require("mongoose");

const contactPageSchema = new mongoose.Schema(
  {
    pageTitle: { type: String, default: "Contact Us – Let’s Connect!" },
    contactEmail: { type: String, default: "info@skbbl.com.np" },
    phone: { type: String, default: "" },
    address: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactPage", contactPageSchema);
