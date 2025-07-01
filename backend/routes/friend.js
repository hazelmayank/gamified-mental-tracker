const express=require("express");
const { authMiddleware } = require("../middleware");
const { User, FriendRequest } = require("../db");
const router=express.Router();


router.get('/', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).populate("friends", "username avatar");
  res.json({ friends: user.friends });
});
 


router.get('/search',authMiddleware,async (req,res)=>{
   
    const query=req.query.query || "";
     

    try{

        const users=await User.find({
            username:{
                $regex:query ,
                $options:'i'
            },
            _id:{
                $ne:req.user.id
            }
        }).select("username avatar _id");

        res.json({users});
    }
    catch(err){
return res.status(500).json({
    msg:"failed to find the user"
})
    }

})

router.post('/request', authMiddleware, async (req, res) => {
  const toUserId = req.body.toUser;


  if (toUserId === req.user.id) {
    return res.status(400).json({
      msg: "You can't add yourself!",
    });
  }

  try {
   
    const existing = await FriendRequest.find({
      fromUser: req.user.id,
      toUser: toUserId,
      status: "pending",
    });

    if (existing.length > 0) {
      return res.status(400).json({
        msg: "You have already sent a request",
      });
    }

    
    await FriendRequest.create({
      fromUser: req.user.id,
      toUser: toUserId,
      status: "pending",
    });

    res.json({
      msg: "Friend request sent!",
    });

  } catch (err) {
    console.error("Failed to send friend request:", err);
    res.status(500).json({ msg: "Server error while sending request" });
  }
});



router.get('/requests',authMiddleware,async (req,res)=>{
    const allrequests=await FriendRequest.find({
        toUser:req.user.id,
        status:"pending"
    }).populate("fromUser","username avatar");

   res.json({
    allrequests
   })
})


router.post('/respond',authMiddleware,async (req,res)=>{
  try{

    const {requestId , action }=req.body;

    if(!["accept","reject"].includes(action)){
        return res.status(400).json({
            msg:"Invalid respond to pending request !"
        })
    }

    const request=await FriendRequest.findById(requestId);

    if(request.toUser.toString()!==req.user.id){
        return res.status().json({
            msg:"Not authorized to respond to this request"
        })
    }

    if(action==="accept"){
        await User.findByIdAndUpdate(
           req.user.id
        ,{
            $addToSet:{friends:request.fromUser}
        })

          await User.findByIdAndUpdate(request.fromUser, {
        $addToSet: { friends: req.user.id }
      });

      request.status="accepted"
    }
    else{
        request.status="rejected"
    }

    await request.save()

      return res.json({ msg: `Friend request ${action}ed` });

  }
  catch(err){

    console.error("Error responding to friend request:", err);
    res.status(500).json({ msg: "Internal server error" });

  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  const friendId = req.params.id;

  await User.findByIdAndUpdate(req.user.id, {
    $pull: { friends: friendId }
  });
  await User.findByIdAndUpdate(friendId, {
    $pull: { friends: req.user.id }
  });

  res.json({ msg: "Unfriended successfully" });
});


module.exports=router;