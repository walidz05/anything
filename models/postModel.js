const mongoose = require('mongoose');



const postSchema  = new mongoose.Schema({

    title:{
        type:String,
        required:true,
        trim:true
    },
    body:{
         type:String,
        required:true,
        trim:true 
    },

    image:{
        type:String,
        required:true, 
    },

    description:{
       type:String,
        required:true,
        trim:true   
    },

    slug:{
           type:String,
        required:true,  
    },

    userName :{
         type:String,
        required:true,    
    },

    userId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'user'
    } 

},{timestamps:true})

module.exports = mongoose.model('post',postSchema)
