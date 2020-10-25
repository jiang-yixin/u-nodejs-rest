const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');

const constraint = [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
];

const router = express.Router();

router.get('/posts', feedController.getPosts);

router.get('/post/:postId', feedController.getPost);

router.post('/post', constraint, feedController.createPost);

router.put('/post/:postId', constraint, feedController.updatePost);

router.delete('/post/:postId', feedController.deletePost);

module.exports = router;