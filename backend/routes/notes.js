const express = require('express');
const jwt = require('jsonwebtoken');
const Note = require('../models/Note');

const router = express.Router();

// Middleware to verify JWT token
function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.userId = decoded.id;
    next();
  });
}

// Creating a new note
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({
      title,
      content,
      userId: req.userId,
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Getting all notes for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

module.exports = router;
