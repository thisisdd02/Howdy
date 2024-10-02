import { getUserDetailFromToken } from "../helper/getUserDetailFromToken.js";
import UserModel from "../models/UserModel.js";

const updateUser = async(req,res)=>{
    try {
         const token = req.cookies.token || ""
        const user = await getUserDetailFromToken(token)
        const { name,profilePic}  = req.body;
        const updateUser = await UserModel.updateOne({ _id : user._id },{
            name,
            profilePic  
        })  

        const userInfo = await UserModel.findById(user._id)

        return res.json({
            success: true,
            msg: "User updated successfully", 
            data: userInfo
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Error updating user",
            })
    }
}
export{updateUser }