const mongoose = require('mongoose');

const contactQuerySchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactQuery', contactQuerySchema);
