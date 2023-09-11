const express = require('express');
const router = express.Router();
const {isloggedin}= require('./middleware');
const {isAuthor}= require ('./middleware');
const blog = require('../controller/blog')
const multer  = require('multer')
const { storage }= require('../cloudinary')
const upload = multer({ storage })

// ****************grouping route with similar path***************// instead of using 'router.get('/')', in this case you have to remove the path from the route
// get the index page
router.route('/')
    .get(blog.index)
    // post
    .post(isloggedin, blog.post);
    // router.post('/', upload.array('image'), function (req, res, next) {
    //         console.log(req.files)
    //         console.log(req.body) 
    //         res.send('sent')
    //       })

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

