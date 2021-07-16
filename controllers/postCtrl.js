
const formidable = require('formidable');
const  { v4:uuidv4 } = require('uuid');
const fs = require('fs');
const Post  = require('../models/postModel');
const {body,validationResult} = require('express-validator');

const  {htmlToText} = require('html-to-text');

const Comment = require('../models/commentModel');

exports.createPost = (req,res) => {

                const form = formidable({multiples:true})
                
                form.parse(req,async(error,fields,files) => {

                    const {title,body,description,slug,id,name} = fields;

                    console.log(name);
                    
                    const errors = [];

                    if(title === '')
                    {
                    errors.push({msg:'title is Required'})
                    }

                    if(body === '')
                    {
                    errors.push({msg:'body is Required'})
                    }

                    if(description === '')
                    {
                    errors.push({msg:'description is Required'})
                    }

                    if(slug === '')
                    {
                    errors.push({msg:'slug is Required'})
                    }

                    if(Object.keys(files).length === 0) 
                    {
                    errors.push({msg:'no files uploaded'})
                    }

                    else {
                        const {type} = files.image;
                        const split = type.split('/');
                        const extension = split[1].toLowerCase();

                        if(extension !== 'png' && extension !== 'jpg' && extension !== 'jpeg' )
                        {
                            errors.push({msg :`${extension} extension no valid`})
                        }

                        else{
                            files.image.name = uuidv4()  + '.' + extension;
                            
                        }
                        
                    }
                    
                    const uniqeSlug = await Post.findOne({slug})

                    if(uniqeSlug)
                    {
                        errors.push({msg:'Slug Already exists'})
                    }


                    if(errors.length !== 0)

                        {
                            return res.status(400).json({
                                errors,files
                            })
                     }

                            const NewPath = __dirname + `/../client/public/images/${files.image.name}`;

                            fs.copyFile(files.image.path,NewPath, async(error) => {
                                if(!error)
                                {                
                                        const response = await Post.create({
                                            title,
                                            body,
                                            description,
                                            slug,
                                            userId: id,
                                            userName:name,
                                            image:files.image.name
                                })
                                return res.status(200).json({
                                    msg:'post has been created'
                                })  
                                
                                }
                            });   
                            
                            
                 
    }) 

}

exports.getSinglePosts = async(req,res) => {

    const id = req.params.id;
    const page = req.params.page;
    const perPage = 3;
    const skip = (page - 1) * perPage;


   try {
    const count = await Post.find({userId:id}).countDocuments();

    const response = await Post.find({userId:id}).skip(skip).limit(perPage).sort({updatedAt:-1})

    return res.status(200).json({
        response,count,perPage
    })
       
   } catch (error) {
       
   }
}


exports.fetchPostEdit = async(req,res) => {


    const id = req.params.id;


    try {

        const post = await Post.findOne({_id:id})

      

        return res.status(200).json({
            post
        })
        
    } catch (error) {
        return res.status(500).json({
            errors:error
        })  
        
    }

    


}

exports.updateValidation = [

    body('title').not().isEmpty().trim().withMessage('title is Required'),
    body('body').not().isEmpty().trim().custom(value => {
        let bodyValue = value.replace(/\n/g, '');
        console.log(bodyValue)
        if(htmlToText(bodyValue).trim().length === 0)
        {
            console.log(htmlToText(bodyValue).trim().length);
            return false;
        }
        else {
            return true;
        }
    }).withMessage('body is Email'),
    body('description').not().isEmpty().withMessage('desc is required'),

]

exports.updatePost = async(req,res) => {


    const {title,body,description,id} = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
        return res.status(400).json({
            errors:errors.array()
        })
    }
    else {
        try {

            const response = await Post.findByIdAndUpdate(id,{
                title,
                body,
                description
            })

            return res.status(200).json({
                msg:'Update SuccessFUly'
            })
            
        } catch (error) {
            
        }
    }

    


}

exports.updateImg = (req,res) => {

  const form = formidable({multiples:true})

    form.parse(req,(errors,fields,files) => {

        const {id} = fields

        const imageErrors = [];

        if(Object.keys(files).length === 0)
        {
            imageErrors.push({msg:'please choose image'})
        }
        else{
            const {type} = files.image;
            const split = type.split('/');
            const extension = split[1].toLowerCase();

            if(extension !== 'jpg' &&  extension !== 'png' && extension !== 'jpeg')
            {
                imageErrors.push({msg:`${extension} is not valid extension`})
            }

            else{
                files.image.name = uuidv4() + '.' + extension;
            }
        }

        if(imageErrors.length !==0)
        {
            return res.status(400).json({
                errors:imageErrors
            })
        }
        else{

            const newPath = __dirname + `/../client/public/images/${files.image.name}`;
            fs.copyFile(files.image.path,newPath,async(error) => {

                if(!error)
                {
                    try {

                        const response = await Post.findByIdAndUpdate({_id:id},{image:files.image.name})
                        return res.status(200).json({
                        
                            msg:'Update Image SuccessFuly'
                        })
                        
                    } catch (error) {
                          return res.status(500).json({
                               errors:error,msg:error.message
                        }) 
                    }
                }
            })
        }
    })
}

exports.deletePost = async (req,res) => {

    const id = req.params.id

    try {

        const response = await Post.findByIdAndRemove(id);
        return res.status(200).json({
            msg:'Your Post has been deleted'
        })
        
    } catch (error) {
         return res.status(500).json({
         errors:error,msg:error.message
         }) 
    }
    
} 

exports.homePost = async(req,res) => { 

   
    const page = req.params.page;
    const perPage = 3;
    const skip = (page - 1) * perPage;

    try {

        const count = await Post.find({}).countDocuments();
        const  posts  = await Post.find({}).skip(skip).limit(perPage).sort({updatedAt:-1});
        return res.status(200).json({
            response:posts,count,perPage
        })
    } catch (error) {
          return res.status(500).json({
         errors:error,msg:error.message
         }) 
    }
} 

exports.Details = async(req,res) => {

    const id = req.params.id;

     try {

        const post = await Post.findOne({slug:id});
        const comments = await Comment.find({postId:post._id}).sort({updatedAt:-1});

        return res.status(200).json({
            post,
            comments
        })
         
     } catch (error) {
         
     }

}

exports.Comment = async(req,res) => {


    const {id,comment,userName} = req.body;
    console.log(id,comment,userName);
    try {

        const response = await Comment.create({
            postId:id,
            comment,
            userName 
        })

        return res.status(200).json({
            msg:'your Comment has been published'
        })
        
    } catch (error) {
        
    }
    
}





