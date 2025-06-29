const express=require("express");
const app=express();
const mainRouter=require("./routes/index");


app.use('/api/v1',mainRouter);

app.listen(3000,()=>{
    console.log("Server is running on the port 3000")
})