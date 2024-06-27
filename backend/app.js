const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://noy96:homework2@noycluster.ikwhzlg.mongodb.net/noteApp?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const noteSchema = new mongoose.Schema({
  id: Number,
  title: String,
  author: {
    name: String,
    email: String
  },
  content: String,
});

const Note = mongoose.model('Note', noteSchema);

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    id: body.number,
    title: body.title,
    author: body.author ? {
      name: body.author.name,
      email: body.author.email
    } : null,
    content: body.content,
  });

  note.save()
    .then(savedNote => {
      response.status(201).json(savedNote);
    })
    .catch(error => {
      response.status(500).json({ error: 'Error saving note' });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
