const path = require('path');
const fs = require('fs');

const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Post
        .find()
        .countDocuments()
        .then(total => {
            totalItems = total;
            return Post
                .find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then(posts => {
            res
                .status(200)
                .json({ message: 'getPosts OK', posts, totalItems });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    if (!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title,
        imageUrl,
        content,
        creator: {
            name: 'Simon',
        },
    });

    post
        .save()
        .then(result => {
            res.status(201).json({
                message: "Create post successfully.",
                post: result,
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error(`Failed to get post with id ${postId}`);
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'getPost OK', post });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updatePost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image; // old image

    if (req.file) {
        // new image
        imageUrl = req.file.path;
    }

    if (!imageUrl || imageUrl === undefined) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }

    Post
        .findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('No post founded');
                error.statusCode = 404;
                throw error;
            }

            if (post.imageUrl !== imageUrl) {
                clearImage(post.imageUrl);
            }

            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;

            return post.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Post is updated', post: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deletePost = (req, res, next) => {
    postId = req.params.postId;
    Post
        .findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('No post founded');
                error.statusCode = 404;
                throw error;
            }

            // check user rights

            clearImage(post.imageUrl);

            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            res.status(200).json({ message: 'Post is deleted.' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

const clearImage = filePath => {
    fpath = path.join(__dirname, '..', filePath);
    fs.unlink(fpath, err => console.log(err));
};
