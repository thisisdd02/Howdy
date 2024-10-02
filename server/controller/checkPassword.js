import UserModel from "../models/UserModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const checkPassword = async(req,res)=>{
    try {
        const {password,userId} = req.body
        const user = await UserModel.findById(userId)
        const isValidPassword = await bcrypt.compare(password,user.password)
        if(!isValidPassword){
            return res.status(400).json({msg:"please check password"})
        }
        const tokenData ={
            id : user._id, 
            email : user.email
        }
        const token = await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:'1d'})

        const cookieOptions ={
            httpOnly:true,
        }

        return res.cookie('token',token,cookieOptions).status(200).json({
            msg: "Login successfully",
            token : token,
            success :true
        })

    } catch (error) {
        console.log(error)
        res.json({msg:"Internal server error",error})
    }
}

export {checkPassword}