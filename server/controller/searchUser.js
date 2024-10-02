import UserModel from "../models/UserModel.js";

const searchUser = async(req,res)=>{

    try {
        const {search} =req.body;

        const query = new RegExp(search,"i","g")

        const user = await UserModel.find({$or:[{name:query},{email:query}]}).select("-password")

        res.json({sccess:true , message:"all user" ,data:user})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error" ,data:[]})    
    }

}

export {searchUser}