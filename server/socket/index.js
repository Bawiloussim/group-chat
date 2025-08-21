// socket/index.js
// Example: organize your socket.io logic here

module.exports = (io, users, messages, rooms, typingUsers) => {
    io.on('connection', (socket) => {
        // Place your socket event handlers here
        // Example:
        // socket.on('custom_event', (data) => { ... });
    });
};
