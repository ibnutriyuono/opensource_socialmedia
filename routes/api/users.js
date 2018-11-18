const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// keys
const keys = require('../../config/keys');

// load user model
const User = require('../../models/User');

/*  @route GET /api/users/test
    @desc test users route
    @access public
*/
router.get('/test', (req, res) => {
    res.json({
        msg: "Users works!"
    });
});

/*  @route POST /api/users/register
    @desc Register user
    @access public
*/
router.post('/register', (req, res) => {
    const { 
        errors, 
        isValid 
    } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                errors.email = "Email already exists";
                return res.status(400).json(errors);
            } else {
                const avatar = gravatar.url(req.body.email, {
                    //  s for size, d for default, r for rating
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                });

                // hash password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => {
                                console.log(err)
                            })
                    })
                })
            }
        })
});

/*  @route POST /api/users/login
    @desc Login user JWT
    @access public
*/
router.post('/login', (req, res) => {
    const { 
        errors, 
        isValid 
    } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // find user by email
    User.findOne({
            email
        })
        .then(user => {
            // check for user
            if (!user) {
                errors.email = "User not found"
                return res.status(404).json(errors);
            }
            // check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User matched
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }

                        // sign token
                        jwt.sign(payload,
                            keys.secretOrKey, {
                                expiresIn: 3600
                            },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            });

                    } else {
                        errors.password = "Password incorrect";
                        return res.status(400).json(errors)
                    }
                })
        })
})

/*  @route POST /api/users/current
    @desc Return current user
    @access private
*/
router.get('/current', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json({
        id: req.user.id,
        name:req.user.name,
        email:req.user.email,
        date: req.user.date
    })
})


module.exports = router;