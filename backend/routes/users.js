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
      errors: parsedData.error.errors
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
    //Sorting me -1 is for descending order
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


  if (user.coins < storeItem.cost) {
    await session.abortTransaction();
    return res.status(400).json({ msg: "Not enough Coins" });
  }

  user.coins -= storeItem.cost;
  user.inventory.push(itemName);
  await user.save({ session });

  await session.commitTransaction();
  session.endSession();

  res.json({ msg: "Item purchased", coins: user.coins, inventory: user.inventory });
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
});

router.post('/equip-avatar',authMiddleware,async (req,res)=>{
  const {avatar}=req.body;
  const user=await User.findById(req.user.id);
  if(!user.inventory.includes(avatar)){
    return res.status(400).json({
      msg:"No such avatar found in inventory"
    })
  };

  user.avatar=avatar;
  await user.save();
  return res.json({
    msg:`${avatar} equipped successfully!`
  })
});

router.get("/daily-quests", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure fallback if questLastReset is missing
    const lastReset = new Date(user.questLastReset || 0).toDateString(); // ← ✅
    const today = new Date().toDateString();

    if (lastReset !== today) {
      user.dailyQuests.forEach(q => q.completed = false);
      user.questLastReset = new Date();
      await user.save();
    }

    res.json({ quests: user.dailyQuests });
  } catch (error) {
    console.error("Error in /daily-quests:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/complete-quest", authMiddleware, async (req, res) => {
  const { questText } = req.body;
  const user = await User.findById(req.user.id);

  const quest = user.dailyQuests.find(q => q.text === questText);
  if (!quest) return res.status(400).json({ error: "Quest not found" });
  if (quest.completed) return res.status(400).json({ error: "Already completed" });

  quest.completed = true;
  user.xp += 5;
  const now = new Date();
const lastActive = user.lastActive ? new Date(user.lastActive) : null;
const oneDay = 1000 * 60 * 60 * 24;

if (!lastActive || now - lastActive >= oneDay) {
  const last = new Date(lastActive).toDateString();
  const today = now.toDateString();

  if (lastActive && last === new Date(now - oneDay).toDateString()) {
    // Consecutive day → streak++
    user.streak += 1;
  } else {
    // Missed a day → reset
    user.streak = 1;
  }

  user.lastActive = now;
}

  await user.save();

  res.json({ success: true, newXP: user.xp, newStreak: user.streak });
});



module.exports=router;