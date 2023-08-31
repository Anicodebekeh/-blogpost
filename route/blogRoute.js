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
    if(!blog){
        req.flash('error', 'This blog do not exist')
        return res.redirect(`/blog`)
    }
        return res.render("blog/edit.ejs", {blog})
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
    const blog =await Blog.findByIdAndUpdate(id, req.body, {runValidators:true});
    if (!blog.user.equals(req.user._id)){
        req.flash('error','You do not have the permission')
        return res.redirect(`/blog/${blog._id}`)
    }else{
        req.flash('success', 'Edited successfully')
        return res.redirect(`/blog/${blog._id}`)
    }
});

module.exports= router

//check if the loggedin user is the same user who created the campground 
// const checkUser = ((req, res, next)=>{
// if (!blog.user.equals(req.user._id)){
//     res.flash('error','You do not have the permission')
//     return res.redirect ('/blogs')
// }else{
//     next()
// }
// })