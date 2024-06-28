const express = require('express');
const Note = require('./schema');

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
  
  //Get 10 notes
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
  

  // app.get('/', async (req, res) => {
  //   try {
  //     const { _page = 1, _per_page = 10 } = req.query;
  //     const skip = (_page - 1) * _per_page;
      
  //     const totalNotesCount = await Note.countDocuments();
  //     const notes = await Note.find()
  //       // .sort({ id: 1 })
  //       .skip(skip)
  //       .limit(_per_page)
  //       .exec();
  
  //     res.status(200).json({
  //       notes: notes,
  //       totalNotesCount: totalNotesCount
  //     });
  //   } catch (error) {
  //     res.status(500).json({ message: 'Error fetching notes' });
  //   }
  // });

  // Get specific note
  // app.get('/:id', (request, response) => {
  //   const noteId = request.params.id

  //   Note.find({id: noteId}).then(notes => {
  //     response.json(notes)
  //   })
  // })


  app.get('/:index', async (request, response , next) => {
    const noteIndex = request.params.index
    Note.find()
    .then(notes => {
      
      const noteToGet = notes[noteIndex - 1];
      response.json(noteToGet)
         })
         .catch(error => next(error))
    
  });
  module.exports = app;

  // Delete specific note
  app.delete('/:index', (request, response, next) => {
    const noteIndex = request.params.index

    // const noteToDelete = 
    // Note.deleteOne({id: noteId})
    //   .then(result => {
    //     response.status(204).end()
    //   })
    //   .catch(error => next(error))


    Note.find()
    .then(notes => {
      
      const noteToDelete = notes[noteIndex];
      return Note.deleteOne({ _id: noteToDelete._id });
    })
    .then(result => {
           response.status(204).end()
         })
         .catch(error => next(error))
});
  

  // Update note
  app.put('/:index', (request, response, next) => {
    const noteIndex = request.params.index
    const body = request.body
  
    const note = {
      content: body.content,
    }
  
    // Note.findOneAndUpdate({id: noteId}, note, { new: true })
    //   .then(updatedNote => {
    //     response.json(updatedNote)
    //   })
    //   .catch(error => next(error))

    Note.find()
    .then(notes => {
      
      const noteToEdit = notes[noteIndex];
      return Note.findOneAndUpdate({ _id: noteToEdit._id } , note, { new: true });
    })
    .then(updatedNote => {
          response.json(updatedNote)
         })
         .catch(error => next(error))
  })
