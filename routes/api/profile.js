const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const router = express.Router();

// load model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// load input validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

/*  @route GET /api/profile/test
    @desc test profile route
    @access public
*/
router.get('/test', (req, res) => {
    res.json({
        msg: "Profile works!"
    });
});

/*  @route GET /api/profile
    @desc GET current profile 
    @access private
*/
router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const errors = {};
    Profile.findOne({
            user: req.user.id
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noProfile = 'There is no profile for this user'
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => {
            res.status(404).json(err);
        })
})

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
    '/',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        const {
            errors,
            isValid
        } = validateProfileInput(req.body);

        // Check Validation
        if (!isValid) {
            // Return any errors with 400 status
            return res.status(400).json(errors);
        }

        // Get fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername)
            profileFields.githubusername = req.body.githubusername;
        // Skills - Spilt into array
        if (typeof req.body.skills !== 'undefined') {
            profileFields.skills = req.body.skills.split(',');
        }

        // Social
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

        Profile.findOne({
            user: req.user.id
        }).then(profile => {
            if (profile) {
                // Update
                Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    new: true
                }).then(profile => res.json(profile));
            } else {
                // Create

                // Check if handle exists
                Profile.findOne({
                    handle: profileFields.handle
                }).then(profile => {
                    if (profile) {
                        errors.handle = 'That handle already exists';
                        return res.status(400).json(errors);
                    }

                    // Save Profile
                    new Profile(profileFields).save().then(profile => res.json(profile));
                });
            }
        });
    }
);

// @route   GET api/profile/handle/:handle
// @desc    GET profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    Profile.findOne({
            handle: req.params.handle
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noProfile = "There is no profile for this user";
                return res.status(404).json(errors);
            }
            res.json(profile)
        })
        .catch(err => {
            res.status(404).json(err)
        })
});

// @route   GET api/profile/user/:user_id
// @desc    GET profile by user id
// @access  Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({
            handle: req.params.user_id
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noProfile = "There is no profile for this user";
                return res.status(404).json(errors);
            }
            res.json(profile)
        })
        .catch(err => {
            res.status(404).json({
                profile: 'There is no profile for this user'
            })
        })
})

// @route   GET api/profile/all
// @desc    GET all profile 
// @access  Public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noProfile = "There are no profiles";
                return res.status(404).json(errors);
            }
            res.json(profiles)
        })
        .catch(err => {
            res.status(404).json({
                profile: 'There are no profiles '
            })
        })
})

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validateExperienceInput(req.body)

    // Check Validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.title,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            // add experience to array
            profile.experience.unshift(newExp)
            // save
            profile.save()
                .then(profile => res.json(profile))
                .catch(err => res.json(err))
        })
});

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validateEducationInput(req.body)

    // Check Validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            // add experience to array
            profile.education.unshift(newEdu)
            // save
            profile.save()
                .then(profile => res.json(profile))
                .catch(err => res.json(err))
        })
});

module.exports = router;