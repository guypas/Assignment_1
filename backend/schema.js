const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    id: Number,
    title: String,
    author: {
    name: String,
    email: String
    } || null,
    content: String,
})

const Note = mongoose.model('Note', noteSchema)

module.exports = Note;