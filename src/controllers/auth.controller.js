const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt= require("jsonwebtoken")

/**
 * @name registerUserController
 * @description register a new user, expects username,email and passwrord
 * @access Public
 */
async function registerUserController(req,res){

    const {username,email,password}= req.body

    if (!username || !email || !password){
        return res.status(400).json({
            message:"Please provide username,email and password"
         })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{username}, {email}]
    })

    if (isUserAlreadyExists){
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        })
    }

    const hash= await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token",token)

    res.status(201).json({
        message:"User registered successsfuly!",
        user:{
            id:user._id,
            username: user.username,
            email: user.email
        }
    })

}

/**
 * @name loginUserController
 * @description login a user, expects email and password in request body
 * @access Public
 */

async function loginUserController(req,res){
    const {email,password} = req.body

    const user = await userModel.findOne({email})

    if (!user){
        return res.status(400).json({
            message: "Invalid email"
        })
    }

    const isPasswordValid= await bcrypt.compare(password,user.password)

    if (!isPasswordValid){
        return res.status(400).json({
            message:"Invalid password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)
    res.status(200).json({
        message:"User successfully Logged In!!",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
,        }
    })
}

async function logoutUserController(req,res){
    const token= req.cookies.token

    if(token){
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message:"User logged out successfully"
    })
}


module.exports={
    registerUserController,
    loginUserController,
    logoutUserController
}