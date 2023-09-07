const express = require('express');
const router = express.Router();
const {Blog} = require('../model/blogSchema');
const {isloggedin}= require('./middleware');
const {isAuthor}= require ('./middleware');
const wrapAsync = require('../utils/wrapAsync');
const AppError = require('../utils/appError');

// get the index page
router.get('/', async(req, res)=>{
    const blogs =await Blog.find()
    res.render('blog/index.ejs', {blogs})
});

// newblog form
router.get('/newblog', isloggedin, (req, res)=>{
   res.render('blog/new.ejs')
});

// post
router.post('/', isloggedin, wrapAsync(async (req, res)=>{
    if(!req.body.blog){
        //   res.render('blog/new.ejs')
        throw new AppError('invalid data', 400)

    }
    const blog = await new Blog(req.body)
    blog.user = req.user._id
    await blog.save()
    req.flash('success', 'created successfully')
    res.redirect("/blog")
}));

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
    await Blog.findByIdAndDelete(id)
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

