const express=require("express");
const router=express.Router();
const zod=require("zod");

const { User } = require("../db");

const {ChallengeRoom}=require('../db');
const { authMiddleware } = require("../middleware");

const createChallengeSchema = zod.object({
  name: zod.string().min(3, "Name is required").max(100),
  isPrivate: zod.boolean().optional()
});

const submissionSchema = zod.object({
  text: zod.string().min(1, "Submission text required")
});

router.post('/',authMiddleware,async (req,res)=>{
    const parsed=createChallengeSchema.safeParse(req.body);
    if(!parsed.success){
        return res.status(411).json({
            msg:"Invalid input",
            errors:parsed.error.errors
        })
    }

    const {name, isPrivate=false}=parsed.data;
    try{

        const newChallenge=await ChallengeRoom.create({
            name,
            isPrivate,
            creator:req.user.id,
           
            participants:[req.user.id]

        })

         res.status(201).json({ msg: "Challenge created", challenge: newChallenge });

    }
    catch(err){
res.status(500).json({ msg: "Failed to create challenge" });
    }
})

router.post('/join/:id',authMiddleware,async (req,res)=>{

    try{
        const challenge=await ChallengeRoom.findById(req.params.id)

        if(!challenge){
            return res.status(404).json({
                msg:"Challenge not found !"
            })
        }
         if (!challenge.participants.includes(req.user.id)) {
      challenge.participants.push(req.user.id);
      await challenge.save();
    }
     res.json({ msg: "Joined challenge", challenge });
    }
    catch(err){
        return res.status(500).json({
            msg:"Failed to join the challenge"
        })
    }
});

router.post('/submit/:id',authMiddleware,async (req,res)=>{

    const parsed = submissionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ msg: "Invalid input", errors: parsed.error.errors });
  }
  const {text}=parsed.data;
    
    try{

const challenge=await ChallengeRoom.findById(req.params.id);
    if(!challenge){
        return res.status(404).json({
            msg:"The challenge doesn't exists"
        })
    }
     if (!challenge.participants.includes(req.user.id)) {
      return res.status(403).json({ msg: "You are not part of this challenge" });
    }

    challenge.submissions.push({
      user: req.user.id,
      text,
     
    });

     await challenge.save();
    const user = await User.findById(req.user.id);
    user.xp += 10;

     await user.save();
      res.json({ msg: "Submission successful" });


    }
    catch(err){
return res.status(500).json({
    msg:"Failed to submit the challenge"
})
    }
})

router.get('/my',authMiddleware,async (req,res) => {

try{


 const challenges=await ChallengeRoom.find({participants:req.user.id}).populate("creator", "username");
           if(!challenges){
            return res.status(411).json({
                msg:"No challenges joined !"
            })
           }

           res.json({
            challenges
           })

        }
        catch(err){
      
return res.status(500).json({
    msg:"Failed to extract your challenges"
})

        }


})

router.get("/all", async (req, res) => {
  try {
    const challenges = await ChallengeRoom.find({ isPrivate: false }).populate("creator","username").sort({ createdAt: -1 });

    res.json({ challenges });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch public challenges" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const challenge = await ChallengeRoom.findById(req.params.id)
      .populate("creator", "username")
      .populate("submissions.user", "username");

    if (!challenge) {
      return res.status(404).json({ msg: "Challenge not found" });
    }

    res.json({ challenge });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch challenge details" });
  }
});

module.exports=router;