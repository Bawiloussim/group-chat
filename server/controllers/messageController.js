const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
    try {
        const room = req.query.room || 'general';
        const messages = await Message.find({ room }).sort({ timestamp: 1 }).limit(100);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createMessage = async (data) => {
    try {
        const msg = new Message(data);
        await msg.save();
        return msg;
    } catch (err) {
        console.error('Message creation error:', err.message);
        return null;
    } 
};
