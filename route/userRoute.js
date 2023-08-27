const express = require('express');
const router = express.Router();
const passport = require('passport');
const {User}= require('../model/schema')

router.get('/register', (req, res)=>{
    res.render('user/register.ejs')
})

router.post('/register', async(req, res)=>{
  try{
    const {email, username, password} = req.body
    const newUser = new User({email, username})
    const registeredUser = await User.register(newUser, password)
    await registeredUser.save()
    req.flash('success', 'you are welcome')
    return res.redirect('/login')
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



module.exports = router