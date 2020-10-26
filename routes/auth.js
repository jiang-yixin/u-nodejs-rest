const express = require('express');
const { body } = require('express-validator/check');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

const constraint = [
    body('email').isEmail().custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email address already exists.');
            }
        });
    }).normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
];

router.put('/signup', constraint, authController.signup);

router.post('/login', authController.login);

module.exports = router;