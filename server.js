// dependencies
const express = require('express');
const mongoose = require('mongoose');

// routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// express
const app = express();

// port
const port = process.env.PORT || 5000;

// use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// db variable
const db = require('./config/keys').mongoURI;

mongoose.connect(db)
    .then(() => {
        console.log("MongoDb Connected")
    })
    .catch(err => {
        console.log(err)
    })

app.get('/', (req, res) => {
    res.send('hello world')
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})