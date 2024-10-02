import { getUserDetailFromToken } from "../helper/getUserDetailFromToken.js"


const userDetail = async(req,res)=>{
    try {
         const token = req.cookies.token || ""

        //  console.log('token id:', token)

        const user = await getUserDetailFromToken(token)

        return res.json({success:true,user:user,msg:"get user Detail"})

    } catch (error) {
        console.log(error);  
        return res.status(401).json({ success:false, message: "Unauthorized" })   
    }
}

export {userDetail}