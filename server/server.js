// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

const path = require('path');
const connectDB = require('./config/db');
const messageController = require('./controllers/messageController');
const authController = require('./controllers/authController');

// Load environment variables
dotenv.config();
// Connexion à MongoDB
connectDB();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Auth routes (à placer après les middlewares)
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// Store connected users, messages, rooms, and typing users
const users = {};
const messages = [];
const typingUsers = {};
const rooms = { general: [] };

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id };
    io.emit('user_list', Object.values(users));
    io.emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined the chat`);
  });

  // Handle chat messages (with room and read receipts)
  socket.on('send_message', async (messageData) => {
    const room = messageData.room || 'general';
    const message = {
      ...messageData,
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      timestamp: new Date().toISOString(),
      room,
      readBy: [socket.id],
    };
    await messageController.createMessage(message);
    messages.push(message);
    if (!rooms[room]) rooms[room] = [];
    rooms[room].push(message);
    if (rooms[room].length > 100) rooms[room].shift();
    io.to(room).emit('receive_message', message);
    io.emit('notification', { type: 'new_message', message });
  });

  // Read receipt
  socket.on('read_message', (messageId) => {
    const msg = messages.find((m) => m.id === messageId);
    if (msg && !msg.readBy.includes(socket.id)) {
      msg.readBy.push(socket.id);
      io.to(msg.room || 'general').emit('message_read', { messageId, userId: socket.id });
    }
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    if (users[socket.id]) {
      const username = users[socket.id].username;
      
      if (isTyping) {
        typingUsers[socket.id] = username;
      } else {
        delete typingUsers[socket.id];
      }
      
      io.emit('typing_users', Object.values(typingUsers));
    }
  });

  // Handle private messages (with read receipts)
  socket.on('private_message', ({ to, message }) => {
    const messageData = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
      readBy: [socket.id],
    };
    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);
    io.to(to).emit('notification', { type: 'private_message', message: messageData });
  });

  // Room management
  socket.on('join_room', (room) => {
    socket.join(room);
    if (!rooms[room]) rooms[room] = [];
    socket.emit('room_history', rooms[room]);
    io.to(room).emit('notification', { type: 'user_joined_room', user: users[socket.id], room });
  });
  socket.on('leave_room', (room) => {
    socket.leave(room);
    io.to(room).emit('notification', { type: 'user_left_room', user: users[socket.id], room });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const { username } = users[socket.id];
      io.emit('user_left', { username, id: socket.id });
      io.emit('notification', { type: 'user_left', user: { username, id: socket.id } });
      console.log(`${username} left the chat`);
    }
    delete users[socket.id];
    delete typingUsers[socket.id];
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
  });
});

// API routes
app.get('/api/messages', messageController.getMessages);

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io }; 