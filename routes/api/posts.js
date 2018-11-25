const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// load model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
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
});

// @route GET api/posts/:id
// @desc get a post by id
// @access public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .sort({
            date: -1
        })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({
            nopostfound: "No post found with that ID"
        }))
});

// @route Delete api/posts/:id
// @desc delete a post by id
// @access Private
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.params.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.user !== req.user.id) {
                        return res.status(401).json({
                            notauthorized: "USer not authorized"
                        })
                    }
                    // delete
                    post.remove()
                        .then(() => {
                            res.json({
                                success: true
                            })
                        })
                })
                .catch(err => res.status(404).json({
                    postnotfound: "No post found"
                }))
        })
});

// @route POST api/posts/like/:id
// @desc like post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.params.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400), json({
                            alreadylike: 'User already liked this post'
                        });
                    }
                    // add user id to likes array
                    post.likes.unshift({
                        user: req.user.id
                    });
                    post.save()
                        .then(post => res.json(post));
                })
                .catch(err => res.status(404).json({
                    postnotfound: "No post found"
                }))
        })
});

// @route POST api/posts/unlike/:id
// @desc unlike post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.params.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400), json({
                            alreadylike: 'You have not yet liked this post'
                        });
                    }
                    // get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                    // splice out of array
                    post.likes.splice(removeIndex, 1);

                    post.save()
                        .then(post => res.json(post))
                })
                .catch(err => res.status(404).json({
                    postnotfound: "No post found"
                }))
        })
});

module.exports = router;