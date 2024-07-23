const bcrypt = require('bcrypt');
const express = require('express');
const User = require('./schemaUser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express.Router();

// Add new user
app.post('/', async (request, response) => {
    const body = request.body

    if (!body.name || !body.email || !body.username || !body.password) {
        return response.status(400).json({ error: 'Must fill all fields' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);
    
    const user = new User({
        name: body.name,
        email: body.email,
        username: body.username,
        passwordHash: passwordHash,
    })
  
    user.save().then(savedUser => {
      response.status(201).json({ success: 'New user Saved!' });
    })
    .catch(error => {
      response.status(500).json({ error: 'Error saving user' });
    });
  })


//Login
app.post('/login', async (request, response) => {
    const body = request.body

    if (!body.username || !body.password) {
        return response.status(400).json({ error: 'Must fill all fields' });
    }

    const username = body.username;
    try{
        const user = await User.findOne({ username });
        const passwordCorrect = user === null ? false : bcrypt.compare(body.password, user.passwordHash);
        if (! (user && passwordCorrect)){
            response.status(401).json({ error: 'Invalid username or password' });
        }

        const userForToken = {
            username: user.username,
            id: user._id,
        }

        const token = jwt.sign(userForToken, process.env.SECRET);

        response.status(200).send({ token: token, name: user.name, email: user.email });
    } catch (error) {
        response.status(500).json({ error: 'Error logging in' });
    }
})

module.exports = app;