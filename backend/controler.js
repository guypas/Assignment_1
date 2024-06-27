const express = require('express');
const Note = require('./schema');
const { rewriter } = require('json-server');

const app = express.Router()

// Add new note
app.post('/', (request, response) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' });
    }
  
    const note = new Note({
        id: body.number,
        title: body.title,
        author: {
        name: body.author.name,
        email: body.author.email
        } || null,
        content: body.content,
    })
  
    note.save().then(savedNote => {
      response.status(201).json({ success: 'Note Saved!' });
    })
    .catch(error => {
      response.status(500).json({ error: 'Error saving note' });
    });
  })
  
  // Get all notes
  app.get('/', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
  })

  // Get specific note
  app.get('/:id', (request, response) => {
    const noteId = request.params.id

    Note.find({id: noteId}).then(notes => {
      response.json(notes)
    })
  })
  module.exports = app;

  // Delete specific note
  app.delete('/:id', (request, response, next) => {
    const noteId = request.params.id
    Note.deleteOne({id: noteId})
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

  // Update note
  app.put('/:id', (request, response, next) => {
    const noteId = request.params.id
    const body = request.body
  
    const note = {
      content: body.content,
    }
  
    Note.findOneAndUpdate({id: noteId}, note, { new: true })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })
