const bcrypt = require('bcrypt')
const { users } = require('../model')

exports.renderRegisterForm = (req,res)=>{
    res.render("register")
}

exports.registerUser = async (req,res)=>{
    const {username,email,password} = req.body
    await users.create({
     email ,
     username ,
     password :  bcrypt.hashSync(password,8)
    })
 
    res.send("User registered successfully")
 
 }

 exports.renderLoginForm = (req,res)=>{
    res.render("login")
}

exports.loginUser = async (req,res)=>{
    // access email and password 
    const {email,password} = req.body
    if(!email || !password){
        return res.send("Please provide email and password")
    }
    // check if email exists or not
    const user = await users.findAll({
        where : {
            email : email
        }
    })
    if(user.length == 0 ){
        res.send("User doesn't exist with that email")
    }else{
        // check password matches or not
        const isPasswordMatched = bcrypt.compareSync(password,user[0].password)
        if(isPasswordMatched){
            res.send("Loggeed in successfully")
        }else{
            res.send("Invalid password")
        }

    }
    
}