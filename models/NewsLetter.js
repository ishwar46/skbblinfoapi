const mongoose = require("mongoose");
const newsLetterSchema = new mongoose.Schema({
  emails: [{ type: String, required: true, unique: true }],
});

module.exports = mongoose.model("NewsLetter", newsLetterSchema);
