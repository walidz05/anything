const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req,res,next) => {

    const authHeaders = req.headers.authorization;
    const token = authHeaders.split('Bearer ')[1];

    jwt.verify(token,process.env.SERIAL_TOKEN_ACCESS,(err) => {
        if(err)
        {
           return res.status(401).json({
            msg:'please check your token !!!!'
        })  
        }
    })
    next();
};