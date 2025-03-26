const mongoose = require("mongoose");

const individualNoticeSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
});

const noticeSchema = new mongoose.Schema({
  notices: [individualNoticeSchema],
});

module.exports = mongoose.model("Notice", noticeSchema);
