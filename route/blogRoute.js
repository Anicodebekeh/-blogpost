const express = require('express');
const router = express.Router();
const {isloggedin}= require('./middleware');
const {isAuthor}= require ('./middleware');
const blog = require('../controller/blog')

// ****************grouping route with similar path***************// instead of using 'router.get('/')', in this case you have to remove the path from the route
// get the index page
router.route('/')
    .get(blog.index)
    // post
    .post(isloggedin, blog.post);

// newblog form
router.get('/newblog', isloggedin, blog.new);

router.route('/:id')
// showRoute
    .get( blog.show )
// delete request
    .delete( isloggedin, isAuthor, blog.delete )
// put request
    .put( isloggedin, isAuthor, blog.put );

// edit form
router.get('/:id/edit', isloggedin, isAuthor, blog.editForm);



module.exports= router

