const express=require("express");
const router=express.Router();
const userRouter=require("./users");
const authRouter=require('./auth');
const entryRouter=require("./entries")

router.use('/user',userRouter);
router.use('/auth',authRouter);
router.use('/entries',entryRouter);


module.exports=router;

