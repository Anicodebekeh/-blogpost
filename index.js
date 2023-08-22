const express = require ('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Blog = require('./model/schema')


// mongoose connection 
mongoose.connect('mongodb://127.0.0.1:27017/blogPost')
.then(()=> console.log("connected to Mongo"))
.catch((e)=> console.log("error connecting to mongo", e))

// telling express to use view for template rendering
app.set('views', path.join(__dirname, '/views'));
app.set('views enjine', 'ejs');
// parsing the body 
app.use(express.urlencoded({extended:true}));


// new Blog({
//     title:"Ilebaye",
//     body:"llolololololololo",
//     author: "AMTV"
// }).save()


// get the index page
app.get('/blog', async(req, res)=>{
    const blogs =await Blog.find()
    console.log(blogs)
    res.render('index.ejs', {blogs})
});

// newblog form
app.get('/newblog', (req, res)=>{
    res.render('newBlog.ejs')
});

// post a new blog content
app.post('/blog', async (req, res)=>{
    const blog = new Blog(req.body)
    await blog.save()
    console.log(blog)
    res.redirect("/blog")
})





app.put('/blogpost/:id', (req, res)=>{
    res.send("editing my post")
})

app.delete('/blogpost/:id', (req, res)=>{
    res.send("deleting my post")
})




app.listen(3000, ()=>{
    console.log('listening to port 3000')
})



