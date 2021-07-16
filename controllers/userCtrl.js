
const {body,validationResult} = require('express-validator')
const User = require('../models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registerValidations = [
    body('name').not().isEmpty().trim().withMessage('Name is Required'),
    body('email').not().isEmpty().trim().withMessage('Name is Email'),
    body('password').isLength({min:6}).withMessage('password no valid'),
];

exports.loginValidations = [
    body('email').not().isEmpty().trim().withMessage('Name is Email'),
    body('password').not().isEmpty().withMessage('password required'),
];


exports.register = async(req,res) => {

    const {name,email,password} = req.body;

    console.log(name,email,password)

    const errors = validationResult(req) 

    if(!errors.isEmpty())
    {   
      return res.status(400).json({
            errors:errors.array()
        });
    }

    const checkEmail = await User.findOne({email})

    try {

    if(checkEmail)
    {
        return res.status(400).json({
            errors:[{msg:'Email is Already exist'}]
        })
    }

    const hashPassword = await bcrypt.hash(password,12)

    try {

        const user = await User.create({
            name,
            email,
            password:hashPassword
        });

    const token = jwt.sign({user},process.env.SERIAL_TOKEN_ACCESS,{expiresIn:'7d'});

   return res.status(200).json({
        msg : 'your account has been created',token
    })

    } catch (error) {
       return res.status(500).json({
            errors:error
        })  
    }
        
    } catch (error) {
        return res.status(500).json({
            errors:error
        })
    }
}

exports.login = async (req,res) => {

    const {email,password} = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
        return res.status(400).json({
            errors:errors.array()
        })
    }

    try {

        const user = await User.findOne({email})
        
        if(!user)
        {
            return res.status(400).json({
                errors:[{msg:'Email not Exist please sign up'}]
            })
        }

        else {
            const isMatched = await bcrypt.compare(password,user.password)

            if(!isMatched)
            {
              return res.status(400).json({
                errors:[{msg:'dont match your password'}]
            })   
            }

             const token = jwt.sign({user},process.env.SERIAL_TOKEN_ACCESS,{expiresIn:'7d'});

            return res.status(200).json({
              msg:'you have login succesfuly' , token
            })
        }
        
    } catch (error) {
        
        return res.status(500).json({
            errors:error
        })
    }

}

