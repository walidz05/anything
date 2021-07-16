const mongoose = require('mongoose');

const commentSchema  = new mongoose.Schema({

    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'posts',
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    userName:{
    type:String,
    required:true
    }

},{timestamps:true})


module.exports = mongoose.model('comment',commentSchema)
