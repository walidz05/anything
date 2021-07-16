const express = require('express');

const router = express.Router();

const {createPost,getSinglePosts,fetchPostEdit,updatePost,updateValidation,updateImg,deletePost,homePost,Details,Comment} = require('../controllers/postCtrl');

const {auth} = require('../middelwars/auth');


router.post('/create',auth,createPost);

router.get('/:id/:page',auth,getSinglePosts);

router.get('/:id',fetchPostEdit);

router.post('/update',[auth,updateValidation],updatePost)

router.get('/posts/deletePost/:id',auth,deletePost);

router.post('/posts/imgupdate',auth,updateImg);

router.get('/homepage/allPost/:page',homePost)

router.get('/fetch/Details/:id',Details);

router.post('/hind/comment',auth,Comment);


module.exports = router;
