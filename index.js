const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require("path");
const mongoose = require('mongoose');
require('dotenv').config();

const {connect} = require('./config/db')

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profileRoutes');
connect();


const app = express();

//Middlewars
app.use(express.json());
app.use(cors());
app.use(cookieParser())



//ROutes
app.use('/user',userRoutes);
app.use('/post',postRoutes);
app.use('/profile',profileRoutes);
//ROutes



//create server for begginer my application shopping Cart
const port = process.env.PORT || 3400;

if(process.env.MODE_ENV === "production")
{
    app.use(express.static(path.join(__dirname,"/client/build/")));
    app.get('*', (req,res) =>{
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

app.listen(port, () => {
    console.log(`Your Server is Runining in port ${port}`)
})

//Link database type mongodb with our server














