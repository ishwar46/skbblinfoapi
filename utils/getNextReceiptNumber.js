const Counter = require("../models/Counter");

async function getNextReceiptNumber() {
  const counter = await Counter.findOneAndUpdate(
    { id: "receiptNumber" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
}

module.exports = getNextReceiptNumber;
