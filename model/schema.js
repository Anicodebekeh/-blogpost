const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const blogSchema = new Schema({
    title:String,
    body:String,
    author: String
});


const Blog = mongoose.model('Blog', blogSchema);



module.exports=Blog