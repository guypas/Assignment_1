const express = require('express');
const Note = require('./schema');
const jwt = require('jsonwebtoken');
const User = require('./schemaUser');

const app = express.Router()

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if(authorization && authorization.startsWith('Bearer '))
    return authorization.replace('Bearer ', '');
  return null;
}

// Add new note
app.post('/', async (request, response) => {
    const body = request.body
    const token = getTokenFrom(request)

    if (!body.content) {
        return response.status(400).json({ error: 'Content missing, can\'t add note' });
    }
    if(!token)
        return response.status(403).json({ error: 'Token invalid' });

    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findById(decoded.id);
    
    const note = new Note({
        id: body.number,
        title: body.title,
        author: {
        name: user.name,
        email: user.email
        },
        content: body.content,
    })
  
    note.save().then(savedNote => {
      response.status(201).json({ success: 'Note Saved!' });
    })
    .catch(error => {
      response.status(500).json({ error: 'Error saving note' });
    });
  })
  
  // Get 10 notes
  app.get('/', async (request, response) => {
    try {
        const { _page = 1, _per_page = 10 } = request.query;
        const skip = (_page - 1) * _per_page;

        const [notes, totalNotesCount] = await Promise.all([
            Note.find()
                .skip(skip)
                .limit(Number(_per_page))
                .exec(),
            Note.countDocuments()
        ]);

        response.status(200).json({ notes, totalNotesCount });
    } catch (error) {
      response.status(500).json({ message: 'Error fetching notes' });
    }
});

  // Get specific note
  app.get('/:index', async (request, response) => {
    const noteIndex = parseInt(request.params.index, 10);
    try {
        const notes = await Note.find().exec();
        if (noteIndex < 0 || noteIndex >= notes.length) {
            return response.status(404).json({ error: 'Note not found' });
        }
        const noteToGet = notes[noteIndex];
        response.status(200).json(noteToGet);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete specific note.
  app.delete('/:index', async (request, response) => {
    const noteIndex = parseInt(request.params.index, 10);
    const token = getTokenFrom(request)

    if(!token)
      return response.status(403).json({ error: 'Token invalid' });

    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.id);

    try {
        const notes = await Note.find().exec();
        if (noteIndex < 0 || noteIndex >= notes.length) {
            return response.status(404).json({ error: 'Note not found' });
        }
        const noteToDelete = notes[noteIndex];

        if (user.name !== noteToDelete.author.name) {
          return res.status(403).json({ error: 'You aren\'t authorized to delete this note' });
        }

        await Note.deleteOne({ _id: noteToDelete._id });
        response.status(204).end();
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Update note
  app.put('/:index', async (request, response) => {
    const noteIndex = request.params.index
    const body = request.body
    const token = getTokenFrom(request)

    if(!token)
      return response.status(403).json({ error: 'Token invalid' });

    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.id);
  
    const note = {
      content: body.content,
    }
  
    Note.find()
    .then(notes => {
      const noteToEdit = notes[noteIndex];

      if (user.name !== noteToEdit.author.name) {
        return res.status(403).json({ error: 'You aren\'t authorized to edit this note' });
      }

      return Note.findOneAndUpdate({ _id: noteToEdit._id } , note, { new: true });
    })
    .then(updatedNote => {
        response.json(updatedNote)
    })
    .then(result => {
      response.status(201).end()
    })
    .catch(error => {
      console.log(error)
      response.status(500).json({ error: error.message });
    })
  })

  module.exports = app;
