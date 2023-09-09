const {Blog} = require('../model/blogSchema');
const wrapAsync = require('../utils/wrapAsync')

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
})