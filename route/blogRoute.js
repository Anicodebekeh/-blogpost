const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {Blog} = require('../model/blogSchema');
const {isloggedin}= require('./middleware');
const {isAuthor}= require ('./middleware');
const wrapAsync = require('../utils/wrapAsync');
const AppError = require('../utils/appError');


// const joiValidator = (req, res, next)=>{
//     const joiSchema =Joi.object({
//         title: Joi.string().required(),
//         body: Joi.string().required()
//     })
//     const {error}= joiSchema.validate(req.body);
//     console.log(error)
// }




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
    if(!req.body){
        // res.redirect('/new.ejs')
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

