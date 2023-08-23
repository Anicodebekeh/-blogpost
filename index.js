const express = require ('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Blog = require('./model/schema');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');


// mongoose connection 
mongoose.connect('mongodb://127.0.0.1:27017/blogPost')
.then(()=> console.log("connected to Mongo"))
.catch((e)=> console.log("error connecting to mongo", e))

// telling express to use view for template rendering
app.set('views', path.join(__dirname, '/views'));
app.set('views enjine', 'ejs');
// parsing the body 
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
// session object
const sessionOptions={
    secret: 'this is my secret', 
    saveUninitialized:false, 
    resave:false
}
app.use(session (sessionOptions));
app.use(flash());

// flash middleware
app.use((req,res, next)=>{
    res.locals.messages = req.flash('success')
    next()
})


// get the index page
app.get('/blog', async(req, res)=>{
    const blogs =await Blog.find()
    res.render('index.ejs', {blogs})
});

// newblog form
app.get('/newblog', (req, res)=>{
    res.render('newBlog.ejs')
});

// post
app.post('/blog', async (req, res)=>{
    const blog = new Blog(req.body)
    await blog.save()
    req.flash('success', 'created successfully')
    res.redirect("/blog")
});

// showRoute
app.get('/blog/:id', async(req, res)=>{
    const {id} =req.params
    const blog =await Blog.findById(id)
    res.render("show.ejs", {blog})
})

// edit form
app.get('/blog/:id/edit', async (req, res)=>{
    const {id} =(req.params)
    const blog =await Blog.findById(id)
    res.render("edit.ejs", {blog})
});

// delete request
app.delete('/blog/:id/delete', async (req, res)=>{
    const {id} = req.params
    await Blog.findByIdAndDelete(id)
    res.redirect('/blog')
});

// put request
app.put('/blog/:id', async (req, res)=>{
    const {id} = req.params
    const blog = await Blog.findByIdAndUpdate(id, req.body)
    req.flash('success', 'Edited successfully')
    res.redirect(`/blog/${blog._id}`)
});


app.listen(3000, ()=>{
    console.log('listening to port 3000')
})



