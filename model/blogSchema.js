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

    images:[
        {
            url: String,
            filename:String
        }
    ],

    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Blog model
module.exports.Blog=mongoose.model('Blog', blogSchema);



