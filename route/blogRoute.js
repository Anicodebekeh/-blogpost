const express = require('express');
const router = express.Router();
const {isloggedin}= require('./middleware');
const {isAuthor}= require ('./middleware');
const blog = require('../controller/blog')

// get the index page
router.get('/', blog.index);

// newblog form
router.get('/newblog', isloggedin, blog.new);

// post
router.post('/', isloggedin, blog.post);

// showRoute
router.get('/:id', blog.show);

// edit form
router.get('/:id/edit', isloggedin, isAuthor, blog.editForm);

// delete request
router.delete('/:id/', isloggedin, isAuthor, blog.delete);

// put request
router.put('/:id', isloggedin, isAuthor, blog.put);


module.exports= router

