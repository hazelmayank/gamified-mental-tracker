const express=require("express");
const { authMiddleware } = require("../middleware");
const router=express.Router();
const zod=require("zod");
const { Entry,User } = require("../db");
const {StoreItem} =require('../db');
// const { checkandUnlock } = require("../achievements");

const entrySchema=zod.object({
    mood:zod.string().min(1,"Mood is required"),
     journalText: zod.string().optional(),
  habits: zod.array(zod.string()).optional()
})

router.post('/',authMiddleware,async(req,res)=>{
const result=entrySchema.safeParse(req.body);

if(!result.success){
    return res.status(400).json({
        msg:"Invalid Entry Data",
        error:result.error.errors
    })
}

const {mood,journalText,habits=[]}=result.data;

const today=new Date();
today.setHours(0,0,0,0);

try{
    let entry=await Entry.findOne({user:req.user.id , date:today});

    let xpEarned=0;

    if(!entry){
          xpEarned = 10;
      if (journalText) xpEarned += 5;
      if (habits.length > 0) xpEarned += habits.length * 2;
        
    const new_entry=await Entry.create({
            user:req.user.id,
            date:today,
             mood,
        journalText,
        habits,
        xpEarned
        })
     
        const user=await User.findById(req.user.id);
       let bonusXP = 0;
if (user.equippedPet) {
  const petItem = await StoreItem.findOne({ name: user.equippedPet, type: "pet" });
  if (petItem && petItem.bonusPercent) {
    bonusXP = Math.floor(xpEarned * (petItem.bonusPercent / 100));
  }
}

const totalXP = xpEarned + bonusXP;
const previousLevel = user.level;

user.xp += totalXP;

        user.level=Math.floor(0.1*Math.sqrt(user.xp))+1;
        const leveledUp = user.level > previousLevel;
        await user.save();

    //   await checkandUnlock(req.user.id);
        

         return res.status(201).json({ msg: "Entry created", xpEarned,bonusXP,leveledUp,newLevel:user.level });
    }
    else{

    entry.mood = mood;
      entry.journalText = journalText;
      entry.habits = habits; 
      await entry.save();
      return res.json({ msg: "Entry updated" });
    }
    


}
catch(err){

   console.error(err);
    return res.status(500).json({ msg: "Failed to submit entry" });

}


})

router.get('/today',authMiddleware,async (req,res)=>{
             const today=new Date();
             today.setHours(0,0,0,0);

             try{

                const entry=await Entry.findOne({user:req.user.id, date:today});
                if(!entry){
                    return res.status(404).json({
                        msg:"No entry availaible for today"
                    })
                }
           res.json({ entry });

             }
             catch(err){
   res.status(500).json({ msg: "Failed to fetch today's entry" });
             }
})


router.get('/',authMiddleware,async function (req,res) {
   
    try{
 const entries=await Entry.find({user:req.user.id}).sort({date:-1});
 if(!entries){
    return res.json({
        msg:"No entries for the user"
    })
   
 }
  res.json({
        entries
    })
    }
    catch(err){
        res.status(500).json({ msg: "Failed to fetch entries" });
    }
});


router.get('/stats',authMiddleware,async function (req,res) {

    try{

        const entries=await Entry.find({user:req.user.id});

        const moodCount={};
        const habitFrequency={};

        for(const entry of entries){
            
            moodCount[entry.mood]=(moodCount[entry.mood]||0)+1;
        

         for (const habit of entry.habits || []) {
        habitFrequency[habit] = (habitFrequency[habit] || 0) + 1;
      }}
    res.json({
      moodTrends: moodCount,
      habitTrends: habitFrequency
    });

    }
    catch(err){
      res.status(500).json({ msg: "Failed to compute stats" });
    }

    
});


router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // First fetch the entry to access its data
    const entry = await Entry.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!entry) {
      return res.status(404).json({
        msg: "This entry not found or not yours"
      });
    }

    const xpTobeDeducted = entry.habits.length * 2 + 15;

    await Entry.deleteOne({ _id: req.params.id }); 

    const user = await User.findById(req.user.id);
    user.xp = Math.max(0, user.xp - xpTobeDeducted);
    user.level = Math.floor(0.1 * Math.sqrt(user.xp)) + 1;

    await user.save();

    res.json({ msg: "Entry deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete entry" });
  }
});


module.exports=router;

//http://localhost:3000/api/v1/auth/signup


/*
 "username":"mayank",
 "email":"mayankjeefinal@gmail.com",
 "password":"123456"
 
 */