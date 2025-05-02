const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Linking this note to a user
    required: true
  }
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
