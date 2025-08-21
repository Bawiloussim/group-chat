const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    senderId: { type: String, required: true },
    message: { type: String, required: true },
    room: { type: String, default: 'general' },
    isPrivate: { type: Boolean, default: false },
    to: { type: String },
    timestamp: { type: Date, default: Date.now },
    readBy: [{ type: String }],
});

module.exports = mongoose.model('Message', MessageSchema);
