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
  'http://localhost:5173'              // Vite dev server
];

const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (comme les applications mobiles, Postman)
    if (!origin) return callback(null, true);
    
    // Vérifier si l'origine est dans la liste des autorisées
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // Pour les navigateurs anciens
};

app.use(cors(corsOptions));

// Middleware pour parser le JSON
app.use(express.json());

// Ajoutez ce middleware pour logger les requêtes (utile pour le débogage)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Configuration CORS pour Socket.io
const io = socketio(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('Socket.io blocked by CORS:', origin);
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
    res.status(403).json({ 
      error: 'CORS policy violation',
      message: 'The CORS policy for this site does not allow access from the specified Origin.',
      allowedOrigins: allowedOrigins
    });
  } else {
    next(err);
  }
});

// Health check endpoint (important pour Render)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Vos routes et middleware
// ... le reste de votre configuration

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});

// Export pour les tests
module.exports = app;