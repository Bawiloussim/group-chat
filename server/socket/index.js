const Message = require("../models/Message");
const User = require('../models/User');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log("Socket Connected:", socket.id);

        socket.on('joinRoom', async ({ roomId, username }) => {
            try {
                const user = await User.findOneAndUpdate(
                    { username },
                    { socketId: socket.id, isOnline: true },
                    { new: true }
                );

                if (!user) return;

                socket.join(roomId);
                io.to(roomId).emit('userJoined', { user, roomId });

                // Typing indicators
                socket.on('typing', () => {
                    socket.to(roomId).emit("typing", username);
                });

                socket.on("stopTyping", () => {
                    socket.to(roomId).emit("stopTyping", username);
                });

                // Sending a message
                socket.on("sendMessage", async (data) => {
                    try {
                        const message = await Message.create({
                            sender: user._id,
                            room: roomId,
                            content: data.content
                        });
                        const fullMessage = await message.populate("sender", "username");
                        io.to(roomId).emit("newMessage", fullMessage);
                    } catch (err) {
                        console.error("Message creation error:", err.message);
                    }
                });

                // Handle disconnect (within joinRoom scope)
                socket.on("disconnect", async () => {
                    try {
                        const offlineUser = await User.findOneAndUpdate(
                            { socketId: socket.id },
                            { isOnline: false },
                            { new: true }
                        );
                        if (offlineUser) {
                            io.emit("userOffline", offlineUser.username);
                        }
                    } catch (err) {
                        console.error("Disconnect error:", err.message);
                    }
                });

            } catch (err) {
                console.error("JoinRoom error:", err.message);
            }
        });
    });
};
