const logout = async (req,res)=>{

    try{
        const cookieOptions ={
            httpOnly:true,
        }

        return res.cookie('token','',cookieOptions).status(200).json({
            message : "Session Out",
            success :true
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message : "Error Occured",
            success : false
        })

    }
}
export {logout}