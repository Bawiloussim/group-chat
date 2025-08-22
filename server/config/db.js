const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connecté');
    } catch (err) {
        console.error('Erreur de connexion MongoDB:', err.message);
        process.exit(1);
    }
};


module.exports = connectDB;
