const express = require('express');

const router = express.Router();

const {updateName,updatePassword,updateValidationPassword} = require('../controllers/profileCtrl');

const {auth} = require('../middelwars/auth');


router.post('/updatename',auth,updateName);

router.post('/profiles/updatepassword',[auth,updateValidationPassword],updatePassword)



module.exports = router;
