const express = require ('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { User} = require('./model/schema');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const blogRoute = require('./route/blogRoute');
const userRoute = require('./route/userRoute');

// mongoose connection 
mongoose.connect('mongodb://127.0.0.1:27017/blogPost')
.then(()=> console.log("connected to Mongo"))
.catch((e)=> console.log("error connecting to mongo", e))

// telling express to use view for template rendering
app.set('views', path.join(__dirname, '/views'));
app.set('views enjine', 'ejs');
// parsing the body 
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
// session object
const sessionOptions={
    secret: 'this is my secret', 
    saveUninitialized:false, 
    resave:false
}
app.use(session (sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


// flash middleware
app.use((req,res, next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

// this route should be after the flash middleware else you will get the erroe message of flash not define 
app.use('/blog', blogRoute);
app.use('/', userRoute);


app.listen(3000, ()=>{
    console.log('listening to port 3000')
})



