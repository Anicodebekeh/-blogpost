const mongoose = require('mongoose');
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

    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Blog model
module.exports.Blog=mongoose.model('Blog', blogSchema);



