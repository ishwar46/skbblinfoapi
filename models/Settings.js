const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  deleteConfirmation: { type: Boolean, default: false },
});

module.exports = mongoose.model("Settings", settingSchema);
