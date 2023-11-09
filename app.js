const express = require("express")
const { blogs } = require("./model/index.js")
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

const fs = require("fs")


// telling nodejs to accept the incoming data(parsing data)
app.use(express.json()) // cT = application/json handle
app.use(express.urlencoded({extended : true})) // cT = application/x-www-form-urlencoded


app.get("/",async(req,res)=>{
    const allBlogs = await blogs.findAll()
 
    res.render("allBlogs.ejs",{blogs : allBlogs})
})

// get single Blog 
app.get("/blogs/:id",async (req,res)=>{
    const id = req.params.id 
    
    // aako id ko data blogs table bata fetch/find garnu paryo 
    const blog =  await blogs.findAll({where : {
        id : id
     }})

    //  const blog  = await blogs.findByPk(id)

    res.render("singleBlog",{blog})
})

// delete blog
app.get("/delete/:id",async(req,res)=>{
    const id = req.params.id 
    const blog = await blogs.findAll({
        where : {
            id : id 
        }
    })
    const fileName = blog[0].imageUrl 
    const lengthToCut = "http://localhost:3000/".length 
    const fileNameAfterCut = fileName.slice(lengthToCut)
    fs.unlink("./uploads/" + fileNameAfterCut,(err)=>{
        if(err){
            console.log("error occured",err)
        }else{
            console.log("file deleted successfully")
        }
    })
    // aako id ko data(row) chae blogs vanney table bata delete garnu paryo 
   await  blogs.destroy({
        where : {
            id : id
        }
    })
    res.redirect("/")

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
    imageUrl : process.env.BACKEND_URL +  req.file.filename
   })
  res.redirect("/")

})

// edit blog FORM 
app.get("/edit/:id",async (req,res)=>{
    // find the blog with coming id 
    const id = req.params.id 
    const blog = await blogs.findAll({
        where : {
            id : id
        }
    })
    res.render("editBlog",{blog : blog})
})

// edit Form bata aako data handle 
app.post("/edit/:id",upload.single('image'),async (req,res)=>{
    const id = req.params.id 
    const {title,subTitle,description} = req.body
    let fileName 
    if(req.file){
        fileName = req.file.filename
    }

    // fs.unlink("./uploads/test.txt",(err)=>{
    //     if(err){
    //         console.log("error occured",err)
    //     }else{
    //         console.log("File Delete Successfully")
    //     }
    // })
    // old data 
    const oldData = await blogs.findAll({
        where : {
            id : id
        }
    })
    const oldFileName = oldData[0].imageUrl 

    const lengthToCut = "http://localhost:3000/".length
    
    const oldFileNameAfterCut = oldFileName.slice(lengthToCut)


    if(fileName){
        // delete old because naya aairaxa 
        fs.unlink("./uploads/" + oldFileNameAfterCut,(err)=>{
            if(err){
                console.log("error occured",err)
            }else{
                console.log("Old File Deleted successfully")
            }
        })
    }


    await blogs.update({
        title  ,
        subTitle,
        description  , 
        imageUrl : fileName  ? process.env.BACKEND_URL + fileName  : oldFileName
    },{
        where : {
            id : id
        }
    })

    res.redirect("/blogs/" + id)
    

})

app.use(express.static("./uploads/"))

const PORT  = process.env.PORT

app.listen(PORT,()=>{
    console.log("Node js project has started at port " + PORT)
})