const {Blog} = require('../model/blogSchema');
module.exports.isloggedin = ((req, res, next)=>{
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you have to login first')
        return res.redirect('/login')
    }
        return next()
})

// module.exports.storeReturnTo = ((req, res, next)=>{
//     if (req.session.returnTo){
//         res.locals.returnTo = req.session.returnTo
//     }
//     next()
// })

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async(req, res, next)=>{
    const {id } = req.params
    const blog = await Blog.findById(id)
    if(!blog.user.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/blog/${blog._id}`)
    }
    next()
}