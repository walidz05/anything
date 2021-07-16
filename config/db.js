const mongoose  = require('mongoose');
require('dotenv').config();

exports.connect = async () => {

    try {

 const response = await mongoose.connect(process.env.MONGODB_URL,{
     useCreateIndex:true,
     useFindAndModify:false,
     useUnifiedTopology:true,
     useNewUrlParser:true
 });
 console.log('connected created db')
        
    } catch (error) {
 console.log(error)
    }
}