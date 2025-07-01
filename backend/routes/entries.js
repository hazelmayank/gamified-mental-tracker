const express=require("express");
const { authMiddleware } = require("../middleware");
const router=express.Router();
const zod=require("zod");
const { Entry,User } = require("../db");

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
 await User.findByIdAndUpdate(req.user.id, {
        $inc: { xp: xpEarned }
      });

         return res.status(201).json({ msg: "Entry created", xpEarned });
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


router.delete('/:id',authMiddleware,async (req,res)=>{
    try{

        const deleted=await Entry.findOneAndDelete({
            _id:req.params.id,
            user:req.user.id
        })

        if(!deleted){
            return res.status(404).json({
                msg:"This entry not found or not yours"
            })
        }
res.json({ msg: "Entry deleted" });
    }
    catch(err){
 res.status(500).json({ msg: "Failed to delete entry" });
    }
})

module.exports=router;

//http://localhost:3000/api/v1/auth/signup


/*
 "username":"mayank",
 "email":"mayankjeefinal@gmail.com",
 "password":"123456"
 
 */