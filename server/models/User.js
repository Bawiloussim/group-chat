const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    socketId: { type: String },
    isOnline: { type: Boolean, default: false },
},  { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
