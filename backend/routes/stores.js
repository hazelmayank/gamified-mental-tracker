const express=require("express");
const router=express.Router();
const {StoreItem,User} =require("../db");


router.get('/',async (req,res) =>{
    try{
        const allItems=await StoreItem.find({});
        res.json({
            allItems
        })
    }
    catch(err){
        return res.status(500).json({
            msg:"Failed to fetch all the store items"
        })
    }
})

router.get('/:type',async (req,res)=>{
    const {type}=req.params;
    if(![avatar,theme,pets].includes(type)){
        return res.status(411).json({
            msg:"No such type availaible"
        })
    }

    try{

        const allitems=await StoreItem.find({type});
        return res.json(
            allitems
        )

    }
    catch(err){
res.status(500).json({ msg: "Failed to fetch store items" });
    }
})

module.exports=router;