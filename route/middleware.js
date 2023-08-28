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