const express=require("express");
const router=express.Router();
const userRouter=require("./users");
const authRouter=require('./auth');
const entryRouter=require("./entries")
const challengeRouter=require("./challenges");

router.use('/user',userRouter);
router.use('/auth',authRouter);
router.use('/entries',entryRouter);
router.use('/challenges',challengeRouter);


module.exports=router;

//http://localhost:3000/api/v1/entries/