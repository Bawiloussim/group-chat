const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        console.log('Register endpoint called');
        const { username, password } = req.body;
        console.log('Received:', { username, password });
        if (!username || !password) {
            console.log('Missing fields');
            return res.status(400).json({ error: 'Fields required' });
        }
        const existing = await User.findOne({ username });
        if (existing) {
            console.log('User already exists');
            return res.status(400).json({ error: 'User already exists' });
        }
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hash });
        await user.save();
        console.log('User registered:', user.username);
        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Unknown user' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: 'Incorrect password' });
        res.json({ message: 'Login successful', user: { username: user.username, id: user._id } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
