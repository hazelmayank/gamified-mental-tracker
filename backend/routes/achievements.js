const express=require("express");
const { Achievement, User } = require("../db");
const { authMiddleware } = require("../middleware");
const {Entry} =require('../db')
const router=express.Router();

router.get('/',async (req,res)=>{
    try{

        const achievements=await Achievement.find({});
        res.json({achievements})

    }
    catch(err){
        return res.json({
            msg:"failed to fetch all the acheivements!"
        })

    }
})



router.get('/unlocked',authMiddleware,async (req,res)=>{
    try{
const user=await User.findById(req.user.id).populate("achievements");
    res.json({ achievements: user.achievements });
    }
    catch(err){
        return res.status(500).json({
            msg:"Failed to fetch unlocked badges/achievements!"
        })
    }

});



async function checkandUnlock(userId) {
  const user = await User.findById(userId).populate("achievements");
  const allAchievements = await Achievement.find({});
  const unlockedIds = user.achievements.map(a => a._id.toString());
  const newlyUnlocked = [];

  for (const ach of allAchievements) {
    if (unlockedIds.includes(ach._id.toString())) continue;

    const { type, condition, value } = ach.criteria;

    let userStat;
    if (type === "xp") userStat = user.xp;
    else if (type === "level") userStat = user.level;
    else if (type === "entries") {
      const allEntries = await Entry.find({ user: userId });
      userStat = allEntries.length;
    } else continue;

    let qualifies = false;
    if (condition === "gte") qualifies = userStat >= value;
    else if (condition === "eq") qualifies = userStat === value;
    else if (condition === "lt") qualifies = userStat < value;

    if (qualifies) {
      user.achievements.push(ach._id);
      newlyUnlocked.push(ach.name);
    }
  }

  await user.save();
  return newlyUnlocked;
}



router.post('/unlock', authMiddleware, async (req, res) => {
  try {
    const newlyUnlocked = await checkandUnlock(req.user.id);


    if (newlyUnlocked.length === 0) {
      return res.json({ msg: "No new achievements unlocked" });
    }

    res.json({
      msg: "New achievements unlocked!",
      unlocked: newlyUnlocked
    });
  } catch (err) {
    console.error("Unlock error:", err.message);
    res.status(500).json({ msg: "Failed to unlock achievements" });
  }
});



module.exports=router;