const express = require("express")
const { blogs } = require("./model/index.js")
// requiring multerConfig
const {multer,storage} = require("./middleware/multerConfig.js")
const upload = multer({storage : storage})
// const multer = require("./middleware/multerConfig.js").multer
// const storage = require("./middleware/multerConfig.js").storage

const app = express()
// telling nodejs to require and use .env
 require("dotenv").config()

require("./model/index.js")
// say nodejs that we are using ejs, set everything
app.set("view engine","ejs")


// telling nodejs to accept the incoming data(parsing data)
app.use(express.json()) // cT = application/json handle
app.use(express.urlencoded({extended : true})) // cT = application/x-www-form-urlencoded


app.get("/",(req,res)=>{
    res.render("allBlogs.ejs")
})

app.get("/addBlog",(req,res)=>{
    res.render("addBlog")
})

// api for handling formdata
app.post("/addBlog",upload.single('image'), async(req,res)=>{

  
    // const title = req.body.title
    // const subTitle = req.body.subTitle
//    ALTERNATIVE 
    const {title,subTitle,description} = req.body 

  await blogs.create({
    title , 
    subTitle  ,
    description ,
    imageUrl : req.file.filename
   })
   res.send("BLog created successfully")

})


const PORT  = process.env.PORT

app.listen(PORT,()=>{
    console.log("Node js project has started at port " + PORT)
})