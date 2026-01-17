const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    blogId : { type : Number , required : true},// id of the blog in which is commented
    userId : { type : String , required : true},// id of the user who commented
    text : { type : String , required : true},// comment text
    createdAt : {type : Date , default : Date.now} // 
});

const Comment = mongoose.model("Comment" , commentSchema);
module.exports = Comment;