const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// load model
const Post = require('../../models/Post');

// validation
const validationPostInput = require('../../validation/post');

// @route GET api/posts/test
// @desc Test post route
// @access public
router.get('/test', (req, res) => {
    res.json({
        msg: "Posts works!"
    });
});

// @route POST api/posts
// @desc Create a post
// @access private
router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validationPostInput(req.body);

    if (!isValid) {
        // if errors send 400
        return res.status(400).json(errors)
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });
    newPost.save()
        .then(post => res.json(post));
});

// @route GET api/posts
// @desc get all posts
// @access public
router.get('/', (req, res) => {
    Post.find()
        .sort({
            date: -1
        })
        .then(posts => res.json(posts))
        .catch(err => res.status(404))
})

module.exports = router;