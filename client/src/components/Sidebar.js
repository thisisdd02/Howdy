import React, { useState , useEffect} from 'react'
import { HiChat } from "react-icons/hi";
import { HiUserPlus } from "react-icons/hi2";
import {  NavLink, useNavigate } from 'react-router-dom';
import { RiLogoutCircleLine } from "react-icons/ri";
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUser from './EditUser';
import { GoArrowUpLeft } from "react-icons/go";
import UserSearch from './UserSearch';
import {FaImage} from 'react-icons/fa'
import {FaVideo} from 'react-icons/fa'
import { logout } from '../redux/userSlice';

const Sidebar = () => {
    const user = useSelector(state=>state?.user)
    console.log("user",user)
    const[editUser,setEditUser] = useState(false)
    const[allUser,setAllUser] = useState([])
    const[searchOpenUser,setSearchOpenUser] =useState(false)
    const socketConnection = useSelector(state =>state?.user?.socketConnection)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const handleLogout =()=>{
        dispatch(logout())
        navigate('/verify-email')
        localStorage.clear()
    }


    useEffect(()=>{
        if(socketConnection){
            socketConnection.emit('sidebar',user._id)

            socketConnection.on('conversation',(data)=>{
                console.log("conversation",data)

            const conversationUserData = data.map((conversationUser,index)=>{

                if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
                    return{
                        ...conversationUser,
                        userDetails:conversationUser?.sender

                    }
                }
                else if(conversationUser?.receiver?._id !== user?._id){
                    return{
                        ...conversationUser,
                        userDetails:conversationUser?.receiver
                    }
                }
                else{
                    return{
                        ...conversationUser,
                        userDetails:conversationUser?.sender

                    }
                }

            })

                setAllUser(conversationUserData)
            })

        }
    },[socketConnection,user])


  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
        <div className='bg-slate-200 h-full w-12 rounded-2xl py-5 flex flex-col justify-between'>
            <div className=' flex flex-col gap-1'>
                <NavLink  className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-400 rounded-full ${isActive && "bg-slate-400 rounded-full"}`} title='chat'>
                        <HiChat size={20} color='green' />
                 </NavLink>
                 <div className='hover:bg-slate-400 w-12 h-12 flex justify-center items-center rounded-full' title='Add Contact' onClick={()=>setSearchOpenUser(true)}>
                        <HiUserPlus size={22} color='grey' />
                </div>
            </div>
            <div className='flex flex-col items-center gap-1'>
                <button className='mx-auto'title={user?.name} onClick={()=>setEditUser(true)}>
                    <Avatar width={40} height={40} name={user?.name} imageUrl={user?.profilePic} userId={user?._id}/>
                </button>
               
                <button onClick={handleLogout} className='hover:bg-slate-400 w-12 h-12 flex justify-center items-center rounded-full' title='logout'>
                    <RiLogoutCircleLine size={20} color='red' />
                </button>
            </div>
        </div>
        <div className='w-full'> 
        <div className='h-16 flex items-center'>
           <h2 className='text-xl font-bold p-4 text-slate-800 '>Message</h2> 
        </div>
        <div className='bg-slate-200 p-[0.5px]'></div>

        <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-scroll scrollbar'>
            {

                allUser.length === 0 &&(
                    <div className='mt-12'>
                        <div className='flex items-center justify-center my-5'>
                            <GoArrowUpLeft size={50} color='gray'/>
                        </div>
                        <p className='text-lg text-center text-slate-400'>Explore user to start a conversation with</p>
                    </div>
                )
            }
            <div className='flex flex-col gap-4 '>
            {
                allUser?.map((convo, index) => {
                    return(
                        <NavLink to={'/'+convo?.userDetails?._id} key={convo?._id} className="flex items-center p-2 gap-4 border-b-2 border-slate-300 hover:bg-slate-200 ">
                            <div className='px-1 '>
                                <Avatar height={40} width={40}
                                name={convo?.userDetails?.name}
                                imageUrl={convo?.userDetails?.profilePic}
                                userId={convo?._id}
                                 />  
                            </div>
                            <div > 
                                <div className='flex items-center'>
                                    <h3 className="text-ellipsis line-clamp-1 capitalize font-medium text-base">{convo?.userDetails?.name}</h3>
                                </div>
                                <div className='text-slate-500 flex items-center gap-2'> 
                                    {
                                        convo.lastMsg.imageUrl &&(
                                           <div className='flex items-center gap-1'>
                                             <span> <FaImage/> </span> 
                                             {!convo.lastMsg.text && <span>image </span>}
                                             </div>
                                        )
                                    }
                                     {
                                        convo.lastMsg.videoUrl &&(
                                           <div className='flex items-center gap-1'>
                                             <span> <FaVideo/> </span>
                                            { !convo.lastMsg.text && <span> video </span>}
                                            </div>
                                        )
                                    }
                                     <p className='text-ellipsis line-clamp-1 '>{convo?.lastMsg?.text} </p>
                                </div> 
                            </div>
                            {
                                convo?.unseen !==0 &&(
                                    <p className='text-xs w-6 h-6 flex justify-center p-1 bg-primary text-white rounded-full ml-auto'>{convo?.unseen}</p>
                                )
                            }
                         </NavLink>
                    )
                })
            }
            </div>
        </div>
        </div>
        {/* edit user */}

        {
            editUser &&
            <EditUser onClose={()=>setEditUser(false)} data={user}/>
        }

       { /* search user*/}
        {
            searchOpenUser&&(
                    <UserSearch onClose={()=>setSearchOpenUser(false)} /> 
            )
        }

    </div>
  )
}

export default Sidebar