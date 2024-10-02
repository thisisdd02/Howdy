import express from 'express' 
import { registerUser } from '../controller/registerUser.js'
import { checkEmail } from '../controller/checkEmail.js'
import { checkPassword } from '../controller/checkPassword.js'
import { userDetail } from '../controller/userDetail.js'
import { logout } from '../controller/logout.js'
import { updateUser } from '../controller/updateUserDetail.js'
import { searchUser } from '../controller/searchUser.js'

const router = express.Router()

//user Api
router.post('/register', registerUser)  
//verify email
router.post("/verify-email",checkEmail)
//verify Password
router.post("/verify-password",checkPassword)
//get userf Detail
router.get("/user-detail",userDetail)
//user Logout
router.get("/logout",logout)
//updateUser
router.post('/update-user',updateUser)
//search user
router.post('/search-user',searchUser)




export default router