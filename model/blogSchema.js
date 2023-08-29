const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
const Schema = mongoose.Schema;
const {User}= require('./userSchema')



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
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: User
    }
});






// Blog model
module.exports.Blog=mongoose.model('Blog', blogSchema);



