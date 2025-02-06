const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


router.post('/register', async(req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        let existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ username, password: hashedPassword });
        const savedUser = await newUser.save();

        // Generate JWT Token
        const token = jwt.sign({ id: savedUser._id, username: savedUser.username },
            process.env.JWT_SECRET, { expiresIn: '1h' }
        );

        res.status(201).json({
            message: "User registered successfully",
            user: { id: savedUser._id, username: savedUser.username },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Auto-generate JWT on Login
router.post('/login', async(req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, username: user.username },
            process.env.JWT_SECRET, { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.json({
            message: "Login successful",
            user: { id: user._id, username: user.username },
            token // ✅ Auto-generated JWT token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;