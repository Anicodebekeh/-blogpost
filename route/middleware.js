module.exports.isloggedin = ((req, res, next)=>{
    console.log(req. originalUrl)
    if (req.isAuthenticated()){
        return next()
    }
    req.flash('error', 'you have to login first')
    res.redirect('/login')
})