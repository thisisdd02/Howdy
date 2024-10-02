import express from 'express'
import {Server} from 'socket.io'
import { createServer } from 'http';
import { getUserDetailFromToken } from '../helper/getUserDetailFromToken.js';
import UserModel from '../models/UserModel.js';
import { ConversationModel, MessageModel } from '../models/conversationModel.js';
import { getUserConversation } from '../helper/getUserConversation.js';

const app = express()

// socket-connection
const server = createServer(app);
const io = new Server(server,{
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials:true
    }}
);
// socket-url:http://localhost:4000/

//online users
const onlineUser = new Set()

io.on('connection',async(socket)=>{
    console.log('a new client connected',socket.id)
    const token = socket.handshake.auth.token

    //current user detail
    const user = await getUserDetailFromToken(token)

    //create a room
    socket.join(user?._id?.toString())
    onlineUser.add(user?._id?.toString()) 

    io.emit('onlineUser',Array.from(onlineUser))

    socket.on('message-page', async(userId)=>{
        console.log('userId',userId)
        const userDetail =  await UserModel.findById(userId)

        const payload ={
            _id:userDetail?._id,
            name:userDetail?.name,
            email:userDetail?.email,
            profilePic:userDetail?.profilePic,
            online: onlineUser?.has(userId)
        }

        socket.emit('message-user',payload)
         // get previous message 
         const getConversationMessage= await ConversationModel.findOne({
            $or: [
                {
                    sender: user?._id,
                    receiver: userId
                },
                {
                    sender: userId,
                    receiver: user?._id
                }
            ]
        }).populate('messages').sort({updatedAt:-1})

        
         socket.emit('message',getConversationMessage?.messages || [])

    })
   

    //new message
    socket.on('new message',async(data)=>{

        //check conversation b/w both user

        let conversation = await ConversationModel.findOne({
            $or: [
                {
                    sender: data?.sender,
                    receiver: data?.receiver
                },
                {
                    sender: data?.receiver,
                    receiver: data?.sender
                }
            ]
        })
    
        //if conversation is null
        if(!conversation){
            //create a new conversation
           const  createConversation = await ConversationModel({
                sender:data?.sender,
                receiver:data?.receiver
            })
            conversation = await createConversation.save()

        }
        const message = new MessageModel({
            text:data?.text,
            imageUrl:data?.imageUrl,
            videoUrl:data?.videoUrl,
            msgByUserId:data?.msgByUserId
            
        })
        const saveMessage = await message.save();

        const updateConvesation = await ConversationModel.updateOne({_id:conversation?._id},{
            $push:{
                messages:saveMessage?._id
                }
        })
        const getConversationMessage= await ConversationModel.findOne({
            $or: [
                {
                    sender: data?.sender,
                    receiver: data?.receiver
                },
                {
                    sender: data?.receiver,
                    receiver: data?.sender
                }
            ]
        }).populate('messages').sort({updatedAt:-1})

        io.to(data?.sender).emit("message", getConversationMessage?.messages ||[])
        io.to(data?.receiver).emit("message", getConversationMessage?.messages ||[])

        //send conversation
        const conversationSender= await getUserConversation(data?.sender)
        const conversationReceiver= await getUserConversation(data?.receiver)


        io.to(data?.sender).emit("conversation", conversationSender ||[])
        io.to(data?.receiver).emit("conversation", conversationReceiver ||[])
               
    })

    //sidebar
    socket.on('sidebar', async(currentUserId)=>{
        console.log('current user:',currentUserId)

        const conversation= await getUserConversation( currentUserId)
        socket.emit('conversation',conversation)
    })
    //seen
    socket.on('seen', async(msgByUserId)=>{
            let conversation = await ConversationModel.findOne({
                $or: [
                    {sender: user?._id,receiver: msgByUserId},
                    {sender: msgByUserId,receiver: user?._id}
                ]
            })
            const conversationMsgId = conversation?.messages || []
            const updateMsg = await MessageModel.updateMany(
            {
                _id: { $in: conversationMsgId },
                msgByUserId:msgByUserId
            },
            {
                $set: {seen:true}
            }
        )
        const conversationSender= await getUserConversation(user?._id?.toString())
        const conversationReceiver= await getUserConversation(msgByUserId)


        io.to(user?._id?.toString()).emit("conversation", conversationSender ||[])
        io.to(msgByUserId).emit("conversation", conversationReceiver ||[])
    })


    
    //disconnect
    socket.on('disconnect',()=> {
        onlineUser.delete(user?._id?.toString()) 
        console.log('a new client disconnected',socket.id)
    })

})
export {app,server}


