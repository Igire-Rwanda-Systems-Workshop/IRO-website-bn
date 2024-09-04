const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expirationDate: { type: Date, required: true }
});

module.exports = mongoose.model('Token', TokenSchema);
