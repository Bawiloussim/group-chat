const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    try {
        // Vérifier la connexion à la base de données
        if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
            status: 'down', 
            database: 'disconnected' 
        });
        }

        res.json({ 
        status: 'up', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected'
        });
    } catch (error) {
        res.status(503).json({ 
        status: 'down', 
        error: error.message 
        });
    }
});

module.exports = router;