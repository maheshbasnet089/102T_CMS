const express = require("express")
const { blogs } = require("./model/index.js")
const app = express()
// telling nodejs to require and use .env
 require("dotenv").config()

require("./model/index.js")
// say nodejs that we are using ejs, set everything
app.set("view engine","ejs")


// telling nodejs to accept the incoming data(parsing data)
app.use(express.json())
app.use(express.urlencoded({extended : true}))


app.get("/",(req,res)=>{
    res.render("allBlogs.ejs")
})

app.get("/addBlog",(req,res)=>{
    res.render("addBlog")
})

// api for handling formdata
app.post("/addBlog",async(req,res)=>{
  await blogs.create({
    title : req.body.title,
    subTitle : req.body.subtitle,
    description : req.body.description
   })
   res.send("BLog created successfully")

})


const PORT  = process.env.PORT

app.listen(PORT,()=>{
    console.log("Node js project has started at port " + PORT)
})