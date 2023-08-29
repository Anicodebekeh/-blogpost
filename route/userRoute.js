const express = require('express');
const router = express.Router();
const passport = require('passport');
const {User}= require('../model/userSchema');
const {storeReturnTo} = require('./middleware');

router.get('/register', (req, res)=>{
    res.render('user/register.ejs')
})

router.post('/register', async(req, res, next)=>{
  try{
    const {email, username, password} = req.body
    const newUser = new User({email, username})
    const registeredUser = await User.register(newUser, password)
    // this call req.login keeps a user login after registeration instead of being redirected to the login page
    req.login(registeredUser, err =>{
      if (err) return next(err)
      req.flash('success', 'you are welcome')
      return res.redirect('/blog')
      
    })
   
  }
  catch(e){
    req.flash('error', e.message)
    res.redirect('/register')
  }

})

router.get('/login', (req, res)=>{
    res.render('user/login.ejs')
})

// router.post('/login', storeReturnTo,
//   passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res)=> {
//     req.flash('success', 'welcome back')
//     const requestedUrl = res.locals.returnTo || '/blog';
//     res.redirect (requestedUrl)
//   });


  router.post('/login',
  // use the storeReturnTo middleware to save the returnTo value from session to res.locals
  storeReturnTo,
  // passport.authenticate logs the user in and clears req.session
  passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
  // Now we can use res.locals.returnTo to redirect the user after login
  (req, res) => {
      req.flash('success', 'Welcome back!');
      const redirectUrl = res.locals.returnTo || '/blog'; // update this line to use res.locals.returnTo now
      res.redirect(redirectUrl);
  });


router.get('/logout', (req, res)=>{
  req.logout(function (err){
    if (err){
      return next (err)
    }
    req.flash('success', 'logged you out')
    res.redirect('/blog')
  })
})



module.exports = router