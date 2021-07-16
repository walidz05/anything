const User = require('../models/usersModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const {body,validationResult} = require('express-validator')

exports.updateName = async(req,res) => {

        const {name,id} = req.body;

        if(name === '')
        {
            return res.status(400).json({
                errors:[{msg:'name is required'}]
            })
        }

        else {

            try {

                const user = await User.findOneAndUpdate({_id:id},{
                    name:name
                },{new:true})

                const token = jwt.sign({user},process.env.SERIAL_TOKEN_ACCESS,{expiresIn:'7d'})

                return res.status(200).json({
                   token, msg:'your name have updated succesfuly'
                })
            } catch (error) {
                
            }

        }



}


exports.updateValidationPassword = [
    body('current').not().isEmpty().trim().withMessage('current no valid'),
    body('newPassword').isLength({min:6}).withMessage('password no valid'),
 
];

exports.updatePassword = async(req,res) => {

    const {current,newPassword,id} = req.body;

    console.log(current);

    console.log(id);


    const errors = validationResult(req)

    if(!errors.isEmpty())
    {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    else { 
        
        const user  = await User.findOne({_id:id})
        console.log(user);

        if(user) 
        {
            const matche = await bcrypt.compare(current,user.password);

            if(!matche)
            {
                return res.status(400).json({
                    errors:[{msg:'your cuurent password not valid'}]
                })
            }
            else {
                const hash = await bcrypt.hash(newPassword,12);
                const newPasswordUser = await User.findOneAndUpdate({_id:id},{
                    password:hash,
                },{new:true}) 

                 return res.status(200).json({ 
                        msg:'You Password has Been Udpted'
                    })
            }
        }       
    }   
}
