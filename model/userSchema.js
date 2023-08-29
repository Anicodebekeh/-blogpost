const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        require:true
    }   
});

// create a username and a pwd field
userSchema.plugin(passportLocalMongoose)


// user model
module.exports.User = mongoose.model('User', userSchema);