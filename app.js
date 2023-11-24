
const express = require("express")

// requiring multerConfig
const {multer,storage} = require("./middleware/multerConfig.js")
const upload = multer({storage : storage})
// const multer = require("./middleware/multerConfig.js").multer
// const storage = require("./middleware/multerConfig.js").storage
//test
const app = express()
// telling nodejs to require and use .env
 require("dotenv").config()

require("./model/index.js")
// say nodejs that we are using ejs, set everything
app.set("view engine","ejs")

const { renderEditBlog, editBlog, addBlog, renderaddBlogForm, deleteBlog, singleBlog, allBlogs } = require("./controller/blogController.js")
const { renderRegisterForm, registerUser, renderLoginForm, loginUser } = require("./controller/authController.js")


// telling nodejs to accept the incoming data(parsing data)
app.use(express.json()) // cT = application/json handle
app.use(express.urlencoded({extended : true})) // cT = application/x-www-form-urlencoded


app.get("/",allBlogs)

// get single Blog 
app.get("/blogs/:id",singleBlog)

// delete blog
app.get("/delete/:id",deleteBlog)

app.get("/addBlog",renderaddBlogForm)

// api for handling formdata
app.post("/addBlog",upload.single('image'),addBlog )

// edit blog FORM 
app.get("/edit/:id",renderEditBlog)

// edit Form bata aako data handle 
app.post("/edit/:id",upload.single('image'),editBlog)

// Register User 
app.get("/register",renderRegisterForm)

app.post("/register",registerUser)

// login user 
app.get("/login",renderLoginForm)
app.post("/login",loginUser)

app.use(express.static("./uploads/"))
app.use(express.static("./public/"))
const PORT  = process.env.PORT

app.listen(PORT,()=>{
    console.log("Node js project has started at port " + PORT)
})
//test