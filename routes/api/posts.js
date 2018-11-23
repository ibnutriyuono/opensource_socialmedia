const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// load model
const Post = require('../../models/Post');

// @route GET api/posts/test
// @desc Test post route
// @access public
router.get('/test', (req, res) => {
    res.json({
        msg: "Posts works!"
    });
});

// @route POST api/posts/test
// @desc Create a post
// @access private
router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });
    newPost.save()
        .then(post => res.json(post));
});

module.exports = router;