const express=require("express");
const router=express.Router();
const userRouter=require("./users");
const authRouter=require('./auth');
const entryRouter=require("./entries")
const challengeRouter=require("./challenges");
const friendRouter=require("./friend")
const achievementRouter=require('./achievements')
const storeRouter=require('./stores')

router.use('/store',storeRouter)
router.use('/user',userRouter);
router.use('/auth',authRouter);
router.use('/entries',entryRouter);
router.use('/challenges',challengeRouter);
router.use('/friends',friendRouter);
router.use('/achievements',achievementRouter)


module.exports=router;

