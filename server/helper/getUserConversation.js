import { ConversationModel } from "../models/conversationModel.js"

 const getUserConversation =async(currentUserId)=>{
    if(currentUserId){
        const currentUserConversation = await ConversationModel.find({
           $or: [
               {sender: currentUserId},
               {receiver: currentUserId}
           ]
       }).populate('messages').populate('sender').populate('receiver').sort({updatedAt:-1})

       console.log('currentUserConversation',currentUserConversation)

       const conversation = currentUserConversation?.map((convo)=>{
           const CountUnSeenMsg = convo.messages.reduce((preve,curr) => {
            const msgByUserId =curr?.msgByUserId?.toString()
            if(msgByUserId !== currentUserId ){
                return preve + (curr?.seen ? 0 :1)
            }
            else{
                return preve
            }
           },0)
           return{
               _id:convo._id,
               sender:convo.sender,
               receiver:convo.receiver,  
               unseen:CountUnSeenMsg,
               lastMsg:convo.messages[convo.messages.length -1 ]
           }
       })
       return conversation

    //    socket.emit('conversation',conversation)
   }
   else{
         return []
   }
}
export{getUserConversation}