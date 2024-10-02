import UserModel from "../models/UserModel.js";
import bcrypt from 'bcryptjs'

const registerUser = async(req,res)=>{
    try {
        const{name,email,password,profilePic} = req.body;

        const checkEmail  = await UserModel.findOne({email}) //{name,email}

        if(checkEmail){
            return res.json({success:false,msg:"Email already exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const payload = {
            name,
            email,
            profilePic,
            password:hashedPassword
        }
        const user = new UserModel(payload)
        const userSave =await user.save()
        res.json({success:true, user:userSave, msg:"User created successfully"})
 
    } catch (error) {
        console.error(error);  
        res.json({success:false,msg:'something went wrong'}) 
    }
}

export {registerUser}