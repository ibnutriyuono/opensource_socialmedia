// dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// express
const app = express();

// middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(passport.initialize());

// passport config
require('./config/passport.js')(passport);

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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})