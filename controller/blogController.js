const { blogs } = require("../model")

const fs = require("fs")
exports.renderEditBlog = async (req,res)=>{
    // find the blog with coming id 
    const id = req.params.id 
    const blog = await blogs.findAll({
        where : {
            id : id
        }
    })
    res.render("editBlog",{blog : blog})
}


exports.editBlog = async (req,res)=>{
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
    

}

exports.addBlog = async(req,res)=>{

  
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

}

exports.renderaddBlogForm = (req,res)=>{
    res.render("addBlog")
}

exports.deleteBlog = async(req,res)=>{
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

}

exports.singleBlog = async (req,res)=>{
    const id = req.params.id 
    
    // aako id ko data blogs table bata fetch/find garnu paryo 
    const blog =  await blogs.findAll({where : {
        id : id
     }})

    //  const blog  = await blogs.findByPk(id)

    res.render("singleBlog",{blog})
}

exports.allBlogs = async(req,res)=>{
    const allBlogs = await blogs.findAll()
 
    res.render("allBlogs.ejs",{blogs : allBlogs})
}