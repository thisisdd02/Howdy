import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "provide name"]
    },
    email: {
        type: String,
        required: [true, "provide email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "provide password"],
    },
    profilePic :{
        type:String,
        default:""
    }

},{timestamps:true})

const UserModel = mongoose.model('User',userSchema)

export default UserModel 

