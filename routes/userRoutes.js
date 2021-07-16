const express = require('express');
const router = express.Router();
const {register,login} = require('../controllers/userCtrl');
const {registerValidations,loginValidations} = require('../controllers/userCtrl')

router.post('/register',registerValidations,register);

router.post('/login',loginValidations,login)


module.exports = router;