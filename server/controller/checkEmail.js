import UserModel from "../models/UserModel.js";

const  checkEmail = async(req,res)=>{
    try {
        const {email} = req.body;
        const checkEmail = await UserModel.findOne({email}).select("-password");
        if(!checkEmail){
            return res.status(400).json({success:false,msg:"User Not exist"});
        }
        return res.status(200).json({success:true,data:checkEmail,msg:"email verified"});
        
    } catch (error) {
        console.log(error);
        res.json({success:false,msg:"something went wrong"})
        
    }
}


export {checkEmail}