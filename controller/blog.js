const {Blog} = require('../model/blogSchema');
const wrapAsync = require('../utils/wrapAsync')
const AppError = require('../utils/appError');
const { cloudinary } = require('../cloudinary');

// index controller
module.exports.index=async(req, res)=>{
    const blogs =await Blog.find()
    res.render('blog/index.ejs', {blogs})
}

// newForm controller
module.exports.new =(req, res)=>{
    res.render('blog/new.ejs')
}

// post controller
module.exports.post=wrapAsync(async (req, res)=>{
    const {title, body} = req.body
    if(!title && !body) throw new AppError('invalid data', 400)
    const blog = new Blog(req.body)
    blog.images = req.files.map(i => ({url: i.path, filename: i.filename}))
    blog.user = req.user._id
    await blog.save()
    // console.log(blog)
    req.flash('success', 'created successfully')
    res.redirect("/blog")
});

// show controller
module.exports.show=wrapAsync(async(req, res)=>{
    const {id} =req.params
    const blog =await Blog.findById(id).populate('user')
    res.render("blog/show.ejs", {blog})
});

// editForm controller
module.exports.editForm = wrapAsync(async (req, res)=>{
    const {id} =(req.params)
    const blog =await Blog.findById(id);
    if(!blog){
        req.flash('error', 'invalid blog')
        return res.redirect(`/blog`)
    }
        return res.render("blog/edit.ejs", {blog})
});

// delete controller
module.exports.delete=wrapAsync(async (req, res)=>{
    const {id } = req.params
    await Blog.findByIdAndDelete(id)
    req.flash('success', 'Blog deleted successfully')
    res.redirect('/blog')
});

// put controller
module.exports.put = wrapAsync(async (req, res)=>{
    const {id} = req.params
    // console.log(req.body)
    const foundBlog = await Blog.findById(id)
    if(!foundBlog._id.equals(id)){
        throw new AppError('invalid Blog', 404)
    }
    const blog =await Blog.findByIdAndUpdate(id, req.body, {runValidators:true});
    const img = req.files.map(i => ({url: i.path, filename: i.filename}))
    blog.images.push(...img)
    await blog.save()
    if (req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await blog.updateOne ({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
        // console.log(blog)
    }
    req.flash('success', 'Edited successfully')
    return res.redirect(`/blog/${blog._id}`)
});