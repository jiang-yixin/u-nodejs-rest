const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const constraint = [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
];

const router = express.Router();

router.get('/posts', isAuth, feedController.getPosts);

router.get('/post/:postId', isAuth, feedController.getPost);

router.post('/post', isAuth, constraint, feedController.createPost);

router.put('/post/:postId', isAuth, constraint, feedController.updatePost);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;