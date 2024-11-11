// backend/routes/auth.js

const express = require('express');
const router = express.Router();

// Mock database for users
let users = [];

// Signup route
router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    // Simple validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    // Check if user already exists
    const existingUser  = users.find(user => user.username === username);
    if (existingUser ) {
        return res.status(400).json({ message: 'User  already exists' });
    }
    // Create new user
    users.push({ username, password });
    return res.status(201).json({ message: 'User  created successfully' });
});

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.status(200).json({ message: 'Login successful' });
});

module.exports = router;