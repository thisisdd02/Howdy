import mongoose from "mongoose";

export const ConnectDB =async()=>{
    // mongodb+srv://thisisdd02:12341234@cluster0.lxplm.mongodb.net/

    try {
        await mongoose.connect(process.env.MONGODB_URI)

        const connection = mongoose.connection

        connection.on('connection',()=>{
            console.log('MongoDB connected')
        })
        connection.on('error', (err) => {
            console.error(err);
        });
        
    } catch (error) {
        console.log('something went wrong',error);
    }

}