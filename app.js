const express = require("express")
const app = express()
// telling nodejs to require and use .env
 require("dotenv").config()


// say nodejs that we are using ejs, set everything
app.set("view engine","ejs")

app.get("/",(req,res)=>{
    res.render("allBlogs.ejs")
})

app.get("/addBlog",(req,res)=>{
    res.render("addBlog")
})



const PORT  = process.env.PORT

app.listen(PORT,()=>{
    console.log("Node js project has started at port " + PORT)
})