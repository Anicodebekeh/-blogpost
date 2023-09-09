const express = require('express');
const router = express.Router();
const {Blog} = require('../model/blogSchema');
const {isloggedin}= require('./middleware');
const {isAuthor}= require ('./middleware');
const wrapAsync = require('../utils/wrapAsync');
const AppError = require('../utils/appError');
const blog = require('../controller/blog')

// get the index page
router.get('/', blog.index);

// newblog form
router.get('/newblog', isloggedin, blog.new);

// post
router.post('/', isloggedin, blog.post);

// showRoute
router.get('/:id', wrapAsync(async(req, res)=>{
    const {id} =req.params
    const blog =await Blog.findById(id).populate('user')
    res.render("blog/show.ejs", {blog})
}));

// edit form
router.get('/:id/edit', isloggedin, isAuthor, wrapAsync(async (req, res)=>{
    const {id} =(req.params)
    const blog =await Blog.findById(id);
    if(!blog){
        req.flash('error', 'invalid blog')
        return res.redirect(`/blog`)
    }
        return res.render("blog/edit.ejs", {blog})
}));

// delete request
router.delete('/:id/', isloggedin, isAuthor, wrapAsync(async (req, res)=>{
    const {id } = req.params
    // const blog = Blog.findById(id)
    // isEqual(id, blog._id)
    // if(id !== blog._id){
    //     throw new AppError('Blog do not exist')
    // }
    
    await Blog.findByIdAndDelete(id)
    // console.log(id, "blogid:", blog._id)
    req.flash('success', 'Blog deleted successfully')
    res.redirect('/blog')
}));

// put request
router.put('/:id', isloggedin, isAuthor, wrapAsync(async (req, res)=>{
    const {id} = req.params
    // const foundBlog = Blog.findById(id)
    // if(!foundBlog._id.equals(id)){
    //     throw new AppError('invalid Blog', 404)
    // }
    const blog =await Blog.findByIdAndUpdate(id, req.body, {runValidators:true});
    req.flash('success', 'Edited successfully')
    return res.redirect(`/blog/${blog._id}`)
    
}));


module.exports= router

