module.exports.isloggedin = ((req, res, next)=>{
    if (req.isAuthenticated()){
        return next()
    }
    req.flash('error', 'you have to login first')
    res.redirect('/login')
})