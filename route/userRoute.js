const express = require('express');
const router = express.Router();
const passport = require('passport');
const {User}= require('../model/schema')

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

router.post('/login', 
  passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async(req, res)=> {
    req.flash('success', 'welcome back')
    res.redirect('/blog');
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