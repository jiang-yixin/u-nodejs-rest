const express = require('express');
const { body } = require('express-validator/check');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const constraint = [
    body('status').trim().not().isEmpty(),
];

router.get('/status', isAuth, userController.getStatus);

router.put('/status', isAuth, constraint, userController.updateStatus);

module.exports = router;