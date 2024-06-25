const mongoose = require('mongoose')
const express = require('express')
const controller = require('./controler');
require('dotenv').config()

const app = express()

app.use(express.json());
app.use('/api/notes', controller);

const url = process.env.MONGODB_CONNECTION_URL;

mongoose.set('strictQuery',false)

mongoose.connect(url)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(3001, () => {
    console.log('Server running on port 3001')
  })