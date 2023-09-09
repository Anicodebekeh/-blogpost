const {Blog} = require('../model/blogSchema');
const wrapAsync = require('../utils/wrapAsync')
const AppError = require('../utils/appError')

module.exports.index=async(req, res)=>{
    const blogs =await Blog.find()
    res.render('blog/index.ejs', {blogs})
}

module.exports.new =(req, res)=>{
    res.render('blog/new.ejs')
}

module.exports.post=wrapAsync(async (req, res)=>{
    const {title, body} = req.body
    if(!title && !body) throw new AppError('invalid data', 400)
    const blog = new Blog(req.body)
    blog.user = req.user._id
    await blog.save()
    req.flash('success', 'created successfully')
    res.redirect("/blog")
});

module.exports.show=wrapAsync(async(req, res)=>{
    const {id} =req.params
    const blog =await Blog.findById(id).populate('user')
    res.render("blog/show.ejs", {blog})
});

module.exports.editForm = wrapAsync(async (req, res)=>{
    const {id} =(req.params)
    const blog =await Blog.findById(id);
    if(!blog){
        req.flash('error', 'invalid blog')
        return res.redirect(`/blog`)
    }
        return res.render("blog/edit.ejs", {blog})
});

module.exports.delete=wrapAsync(async (req, res)=>{
    const {id } = req.params
    await Blog.findByIdAndDelete(id)
    req.flash('success', 'Blog deleted successfully')
    res.redirect('/blog')
});

module.exports.put = wrapAsync(async (req, res)=>{
    const {id} = req.params
    const foundBlog = await Blog.findById(id)
    if(!foundBlog._id.equals(id)){
        throw new AppError('invalid Blog', 404)
    }
    const blog =await Blog.findByIdAndUpdate(id, req.body, {runValidators:true});
    req.flash('success', 'Edited successfully')
    return res.redirect(`/blog/${blog._id}`)
});