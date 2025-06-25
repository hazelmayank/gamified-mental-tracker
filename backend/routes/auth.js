const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { User } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const signupSchema = zod.object({
  username: zod
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .toLowerCase()
    .trim(),
  email: zod
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: zod
    .string()
    .min(6, "Password must be at least 6 characters")
});

router.post("/signup", async function (req, res) {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      msg: "Invalid input",
      errors: result.error.errors,
    });
  }

  const { username, email, password } = result.data;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists. Please sign in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      msg: "User signup successful!",
      token,
    });
  } catch (error) {
    console.error("Signup error", error.message);
    res.status(500).json({
      msg: "Internal server error!",
    });
  }
});

const signinSchema=zod.object({
    username: zod
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .toLowerCase()
    .trim(),

     password: zod
    .string()
    .min(6, "Password must be at least 6 characters")
})

router.post('/signin',async function(req,res){
    const response=signinSchema.safeParse(req.body);

    if(!response.success){
        return res.status(411).json({
            msg:"Invalid input data"
        })
    }

    const {username ,password}= response.data;
    try{

        const user=await User.findOne({username});

        if(!user){
            return res.status(401).json({
                msg:"No such user is found"
            })
        }

        const isPassword=await bcrypt.compare(password,user.password);
        if(!isPassword){
            return res.status().json({
                msg:"Incorrect password"
            })
        }

        const token=jwt.sign({id:user._id,username:username},JWT_SECRET,{expiresIn:"1h"});

        return res.status(200).json({
            msg:"Sign-in successfull !"
        })

    }
    catch(err){

       console.error("Signin error:", err.message);
    res.status(500).json({
      msg: "Internal server error"

    })}

})

module.exports = router;
