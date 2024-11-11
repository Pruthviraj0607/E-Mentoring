// backend/routes/stories.js

const express = require('express');
const router = express.Router();

// Mock success stories
const successStories = [
    { id: 1, title: 'Student A', content: 'Achieved great success in academics.' },
    { id: 2, title: 'Student B', content: 'Landed a job at a top company.' },
];

// Get all success stories
router.get('/', (req, res) => {
    res.json(successStories);
});

module.exports = router;