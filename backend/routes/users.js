const express=require("express");
const mongoose=require("mongoose");
const { authMiddleware } = require("../middleware");
const zod=require("zod");
const router=express.Router();
const {User, StoreItem}= require("../db")

const updateUserSchema = zod.object({
  username: zod.string().min(3).max(20).optional(),
  avatar: zod.string().optional(),
  theme: zod.string().optional(),
});

const spendSchema = zod.object({
  itemName: zod.string().min(1, "Item name is required"),
 
});



router.get('/me',authMiddleware,async function(req,res){
    try{
    const user=await User.findById(req.user.id).select("-password");
    res.json({user});
    }
    catch(err){
        return res.status(500).json({
            msg:"Error fetching user data"
        })
    }
    

})

router.put('/me/update',authMiddleware,async function(req,res){

    const parsedData=updateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
    return res.status(400).json({
      msg: "Invalid input",
      errors: parsed.error.errors
    });
  }
    const {username,avatar,theme}=parsedData.data;
    try{
        const update={};
        if(username)update.username=username
        if (avatar) update.avatar = avatar;
        if (theme) update.theme = theme;

      const updatedUser=await User.findOneAndUpdate({ _id: req.user.id }, update, { new: true });

       res.json({ msg: "Profile updated", user: updatedUser });
  } 
  catch (err) {
    res.status(500).json({ msg: "Error updating user" });
  }


    
});

router.get('/leaderboard',async function(req,res){
    try{
        const topUsers=await User.find({}).sort({xp:-1}).limit(10).select("username level xp avatar");
        res.json({
            topUsers
        })
    }
    catch(err){
        return res.status(500).json({
            msg:"Failed to fetch the leaderboard"
        })
    }
})

router.get('/inventory',authMiddleware,async function(req,res){
    try{

        const user=await User.findById(req.user.id);
        res.json({
            inventory:user.inventory
        })

    }
    catch(err){
return res.status(500).json({
    msg:"Can't fetch the inventory"
})
    }
});


router.post('/spend',authMiddleware,async function(req,res) {
const parsed = spendSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      msg: "Invalid input",
      errors: parsed.error.errors
    });
  }
    const {itemName}=parsed.data;


    
    const session = await mongoose.startSession();

try {
  session.startTransaction();


  const user = await User.findById(req.user.id).session(session);
  const storeItem = await StoreItem.findOne({ name: itemName }).session(session);

  if(!storeItem){
    await session.abortTransaction();
    return res.status(400).json({
      msg:"No such item found in store"
    })
  }

  if (user.inventory.includes(itemName)) {
  await session.abortTransaction();
  return res.status(400).json({ msg: "Item already owned" });
}


  if (user.xp < storeItem.cost) {
    await session.abortTransaction();
    return res.status(400).json({ msg: "Not enough XP" });
  }

  user.xp -= storeItem.cost;
  user.inventory.push(itemName);
  await user.save({ session });

  await session.commitTransaction();
  session.endSession();

  res.json({ msg: "Item purchased", xp: user.xp, inventory: user.inventory });
} catch (err) {
  await session.abortTransaction();
  session.endSession();
  res.status(500).json({ msg: "Transaction failed" });
}

});

router.post('/equip-pet',authMiddleware,async (req,res)=>{
  const {petName}=req.body;

  const user=await User.findById(req.user.id);
  if(!user.inventory.includes(petName)){
    return res.status(400).json({
      msg:"You don't own this pet !"
    })
  }

  user.equippedPet=petName;
  await user.save();
   res.json({ msg: `${petName} equipped successfully!`, pet: petName });
})

module.exports=router;