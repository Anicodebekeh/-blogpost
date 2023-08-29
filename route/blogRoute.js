const express = require('express');
const router = express.Router();
const {Blog} = require('../model/blogSchema');
const {isloggedin}= require('./middleware')


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
router.post('/', isloggedin, async (req, res)=>{
    const blog = await new Blog(req.body)
    blog.user = req.user._id
    await blog.save()
    req.flash('success', 'created successfully')
    res.redirect("/blog")
});

// showRoute
router.get('/:id', async(req, res)=>{
    const {id} =req.params
    const blog =await Blog.findById(id).populate('user')
    res.render("blog/show.ejs", {blog})
})

// edit form
router.get('/:id/edit', isloggedin, async (req, res)=>{
    const {id} =(req.params)
    const blog =await Blog.findById(id);
    res.render("blog/edit.ejs", {blog})
});

// delete request
router.delete('/:id/delete', isloggedin, async (req, res)=>{
    const {id} = req.params
    await Blog.findByIdAndDelete(id)
   
    res.redirect('/blog')
});

// put request
router.put('/:id', isloggedin, async (req, res)=>{
    const {id} = req.params
    const blog = await Blog.findByIdAndUpdate(id, req.body, {runValidators:true});
    req.flash('success', 'Edited successfully')
    res.redirect(`/blog/${blog._id}`)
});

module.exports= router

