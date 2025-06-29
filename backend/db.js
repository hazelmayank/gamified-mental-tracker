const mongoose=require("mongoose");
mongoose.connect("");

const userSchema=new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    xp:{
        type:Number,
        default:0
    },
    level:{
        type:Number,
        default:1
    },
    avatar:{
        type:String,
        default:"default.png"
    },
    theme:{
        type:String,
        default:"light"
    },
    inventory:[String],
    friends:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }],
        achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Achievement" }]
    
});


const entrySchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    mood:{
        type:String,
        required:true
    },
    journalText:{
        type:String,

    },
    habits:[String],
    xpEarned:{
        type:Number,
        default:0
    }

  
});
  entrySchema.index({user:1,date:1},{unique:true}) 

const challengeRoomschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    isPrivate:{type:Boolean, default:false,required:true},
    creator:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    participants:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    submissions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    submittedAt: { type: Date, default: Date.now }
  }]

});

const itemsBought=new mongoose.Schema({
    name:{type:String,required:true},
    type:{type:String,enum: ["avatar", "theme", "pet"],required:true},
    cost:{type:Number,required:true},
    image:{type:String,required:true}
})

const badgeModel=new mongoose.Schema({
    name:{type:String,},
  criteria: {
    type: {
      type: String,
      enum: ["xp", "level", "entries"],
      required: true
    },
    condition: {
      type: String, 
      enum: ["gte", "eq", "lt"], 
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },

    description:{type:String,require:true},
    icon:{type:String,default:"default.png"}
})

const friendRequestSchema=new mongoose.Schema({
    fromUser:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    toUser:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    status:{type:String,enum:["pending",'accepted',"rejected"],default:"pending"},
    createdAt:{type:Date,default:Date.now}
})

const User = mongoose.model("User", userSchema);
const Entry = mongoose.model("Entry", entrySchema);
const ChallengeRoom = mongoose.model("ChallengeRoom", challengeRoomschema);
const StoreItem = mongoose.model("StoreItem", itemsBought);
const Achievement = mongoose.model("Achievement", badgeModel);
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

module.exports = {
  User,
  Entry,
  ChallengeRoom,
  StoreItem,
  Achievement,
  FriendRequest
};