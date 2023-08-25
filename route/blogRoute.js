const express = require('express');
const router = express.Router();
const {Blog} = require('../model/schema');



// get the index page
router.get('/', async(req, res)=>{
    const blogs =await Blog.find()
    res.render('blog/index.ejs', {blogs})
});

// newblog form
router.get('/newblog', (req, res)=>{
    res.render('blog/newBlog.ejs')
});

// post
router.post('/', async (req, res)=>{
    const blog = new Blog(req.body)
    await blog.save()
    req.flash('success', 'created successfully')
    res.redirect("/blog")
});

// showRoute
router.get('/:id', async(req, res)=>{
    const {id} =req.params
    const blog =await Blog.findById(id)
    res.render("blog/show.ejs", {blog})
})

// edit form
router.get('/:id/edit', async (req, res)=>{
    const {id} =(req.params)
    const blog =await Blog.findById(id)
    res.render("blog/edit.ejs", {blog})
});

// delete request
router.delete('/:id/delete', async (req, res)=>{
    const {id} = req.params
    await Blog.findByIdAndDelete(id)
    res.redirect('/blog')
});

// put request
router.put('/:id', async (req, res)=>{
    const {id} = req.params
    const blog = await Blog.findByIdAndUpdate(id, req.body, {runValidators:true})
    req.flash('success', 'Edited successfully')
    res.redirect(`/blog/${blog._id}`)
});

module.exports= router

