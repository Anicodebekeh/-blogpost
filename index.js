if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require ('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { User} = require('./model/userSchema');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const blogRoute = require('./route/blogRoute');
const userRoute = require('./route/userRoute');
const AppError = require('./utils/appError');
const ejsMate = require('ejs-mate');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const MongoStore = require('connect-mongo');

const dbUrl =  process.env.DB_URL||'mongodb://127.0.0.1:27017/blogPost'

// mongoose connection 
mongoose.connect(dbUrl)
.then(()=> console.log("connected to Mongo"))
.catch((e)=> console.log("error connecting to mongo", e))

// tell express you want to use ejs-mate
app.engine('ejs', ejsMate)
// telling express to use view for template rendering
app.set('views', path.join(__dirname, '/views'));
app.set('views enjine', 'ejs');
// parsing the body 
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
// session object
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
store.on("error", function (e){
    console.log('session store Error', e)
})
const sessionOptions={
    store,
    name:'session',
    secret: 'thisismysecret', 
    saveUninitialized:false, 
    resave:false,
    cookies:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}


app.use(express.static(path.join(__dirname, 'public')))
app.use(session (sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy:false}))


// flash middleware
app.use((req,res, next)=>{
    // console.log(req.query)
    req.session.returnTo
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})

// this route should be after the flash middleware else you will get the erroe message of flash not define 
app.use('/blog', blogRoute);
// app.post('/profile', upload.array('image'), function (req, res, next) {
//     console.log(req.files)
//     console.log(req.body) 
//     res.send('sent')
//   })
app.use('/', userRoute);

// landing page
app.get('/', (req, res) => {
    res.render('blog/home.ejs')
})

// 404 page
app.all('*', (req, res, next) => {
    next(new AppError('page not found', 404))
});

// error handler
app.use((err, req, res, next) => {
    const {status= 404}= err
    if (!err.message)err.message = 'something went wroung'
     res.status(status).render('error.ejs', {err})
});

app.listen(3000, () => {
    console.log('listening to port 3000')
});