const express=require("express");
const app=express();
const mainRouter=require("./routes/index");
const cors=require("cors");
app.use(cors())
app.use(express.json());

app.use('/api/v1',mainRouter);

// app.get('/',function(req,res){
//     res.json({
//         msg:"server is up!"
//     })
// })

app.listen(3000,()=>{
    console.log("Server is running on the port 3000")
})