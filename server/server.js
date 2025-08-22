// Dans votre fichier backend (server.js ou app.js)
const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Configuration CORS pour Express
const allowedOrigins = [
  'https://group-chat-gilt.vercel.app', // Votre frontend en production
  'http://localhost:3000',              // React dev server
  'http://localhost:5173'               // Vite dev server
];

const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (comme les applications mobiles, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// Configuration CORS pour Socket.io
const io = socketio(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware pour gérer les erreurs CORS
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({ error: 'CORS policy violation' });
  } else {
    next(err);
  }
});

// Vos routes et middleware
app.use(express.json());
// ... le reste de votre configuration

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});