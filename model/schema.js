const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
const Schema = mongoose.Schema;


const blogSchema = new Schema({
    title:{
        type: String, 
        required:true
    },
    body:{
        type: String, 
        required:true
    },
    author:{
        type: String, 
        required:true
    }
});


const userSchema = new Schema({
    email: {
        type: String,
        require:true
    }   
});

// create a username and a pwd field
userSchema.plugin(passportLocalMongoose)

// models
module.exports.Blog=mongoose.model('Blog', blogSchema);
module.exports.User = mongoose.model('User', userSchema);


