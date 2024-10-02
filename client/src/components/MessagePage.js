import React, { useRef, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import {useEffect} from 'react'
import {useSelector} from 'react-redux'
import Avatar from './Avatar'
import {HiDotsVertical} from 'react-icons/hi'
import {FaAngleLeft, FaBullseye} from 'react-icons/fa6'
import { FiPlus } from "react-icons/fi";
import { FaRegImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import uploadFile from '../helper/uploadFile'
import { MdOutlineDeleteForever } from "react-icons/md";
import Loading from './Loading'
import wallpaper from '../assets/wallapaper.jpeg'
import { IoSendSharp } from "react-icons/io5"
import moment from 'moment'

const MessagePage = () => {
  const params = useParams()

  console.log('params',params )

  const socketConnection = useSelector(state =>state?.user?.socketConnection)
  const user = useSelector(state => state?.user)

  const[userData,setUserData] =useState({
    name: '',
    email:'',
    profilePic:'',
    online:false,
    _id:""
  })
  
  const[openMenu,setOpenMenu] = useState(false)
  const[loading,setLoading] = useState(false)
  const[allmessage,setAllMessage] = useState([])
  const currentMessage = useRef(null)

  useEffect(()=>{
  if(currentMessage.current){
  currentMessage.current.scrollIntoView({behaviour:'smooth' , block : 'end'})
  }
  },[allmessage])

  const[message,setMessage] = useState({
    text:'',
    imageUrl:'',
    videoUrl:'',
  })

  const handleMenuOpen =()=>{
    setOpenMenu(prev=>!prev)
  }
  const handleImage=async(e)=>{
    const file = e.target.files[0]
    setLoading(true)
    const uploadProfile = await uploadFile(file)
    setLoading(false)
    setOpenMenu(false)

  setMessage(prev=>{
    return{
      ...prev,
      imageUrl:uploadProfile.url
    }
  })
  }
  const handleClearImage= ()=>{
    setMessage(prev=>{
    return{
      ...prev,
      imageUrl:""
    }
  })

  }
  const handleVideo =async(e)=>{
    const file = e.target.files[0]

    setLoading(true)
    const uploadProfile = await uploadFile(file)
    setLoading(false)
    setOpenMenu(false)

  setMessage(prev=>{
    return{
      ...prev,
      videoUrl:uploadProfile.url
    }
  })
  }
  const handleClearVideo =()=>{
    setMessage(prev=>{
      return{
        ...prev,
        videoUrl:""
      }
    })

  }
  const handleOnChange = (e)=>{
    const {name,value} =e.target
    setMessage(prev=>{
      return{
        ...prev,
        text: value
      }
    })}
  const handleSubmit =(e)=>{
    e.preventDefault()
    if(message.text || message.imageUrl ||message.videoUrl){
      if(socketConnection){
        socketConnection.emit('new message',{
          sender:user?._id,
          receiver:params?.userId,
          text:message?.text,
          imageUrl:message?.imageUrl,
          videoUrl:message?.videoUrl,
          msgByUserId:user?._id
        })
        setMessage({text:"",imageUrl:"",videoUrl:""})
      }}}

useEffect(()=>{
  if(socketConnection){
    socketConnection.emit('message-page',params.userId)

    socketConnection.emit('seen',params.userId)

    socketConnection.on('message-user',(data)=>{
      // console.log('user-Details',data)
      setUserData(data)
    })

    //message
    socketConnection.on('message',(data)=>{
      //  console.log('message',data)
       setAllMessage(data)
    })

  }  
},[socketConnection,params.userId,user])


  return (
    <div style={{backgroundImage:`url(${wallpaper})`}} className='bg-no-repeat bg-cover'>
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'> 
         <div className='flex items-center gap-4'>
        <Link to='/' className='lg:hidden'>
          <FaAngleLeft/>
        </Link>
       
          <div>
            <Avatar width={50} height={50} name={userData?.name} imageUrl={userData?.profilePic} userId={userData?._id} />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{userData?.name}</h3>
            <p className='-my-2 text-sm'>
              {
                userData?.online ? <span className='text-primary'> online</span> :<span className='text-slate-500'> offline</span>
              }
            </p>
          </div>
        </div>
        <div>
          <button className='cursor-pointer hover:text-primary'>
          <HiDotsVertical className='text-2xl text-slate-500  hover:text-primary' />
          </button>
        </div>
      </header>
      {/* show all messaage */}
      <section className='h-[calc(100vh-130px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-500 bg-opacity-40'>
      
        {/** show all message */}
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
        {
          allmessage?.map((msg,index)=>{
            return(
              <div  className={`py-1 p-1  rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user?._id === msg?.msgByUserId ? "ml-auto bg-teal-100":"bg-white"}`}>
               {/*for image*/}
               <div className='w-full'>
                {
                  msg.imageUrl&&(
                    <img src={msg.imageUrl}  className='w-full h-full object-scale-down' alt=''/>
                  )
                }
               {/*for video*/}
                {
                  msg.videoUrl&&(
                    <video src={msg.videoUrl}  className='w-full h-full object-scale-down'
                    controls
                     />
                  )
                }
                </div>
                  {/*for text*/}
               <p className='px-3'>{msg.text}</p>
               <p className='text-xs ml-auto w-fit text-slate-500'>{moment(msg.createdAt).format('hh:mm')}</p>
              </div>
            )
          })
        }
        </div>
          {/**image display in message page */}
            {
          message.imageUrl&&(
            <div className='w-full sticky bottom-0 h-full bg-slate-700 bg-opacity-30 flex justify-center items-center overflow-hidden rounded'> 
              <div  className="w-fit p-2 absolute  right-0 top-0 cursor-pointer">
                <button onClick={handleClearImage}>
                <MdOutlineDeleteForever size={20} color='red'/>
                </button>
               </div>
              <div className='bg-white p-3'>
                <img src={message.imageUrl} alt='image' className='aspect-square w-full h-full max-w-md m-2 object-scale-down'/>
              </div>
           </div>
          )
        }
        {/**video display in message page */}
        {
          message.videoUrl&&(
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center overflow-hidden rounded'> 
              <div  className="w-fit p-2 absolute  right-0 top-0  cursor-pointer">
                <button onClick={handleClearVideo}>
                <MdOutlineDeleteForever size={20} color='red'/>
                </button>
               </div>
              <div className='bg-white p-3'>
                <video src={message.videoUrl}  alt='video' className='aspect-square w-full h-full max-w-md m-2 object-scale-down'
                controls
                muted
                autoPlay
                />
              </div>
           </div>
          )
        }
        {
          loading&&(
            <div className='w-full h-full sticky bottom-0 flex justify-center items-center'>
            <Loading/>
            </div>
          )
        }
      </section>
      {/*send message */}
      <section className='h-16 bg-white flex items-center px-4'>
        <div className='relative' >
          <button onClick={handleMenuOpen} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
             <FiPlus size={20}/>
          </button>
          {/* video*/ }
          {
          openMenu && ( 
           <div className='bg-white shadow rounded absolute w-36 p-2  bottom-14'> 
            <form>
              <label htmlFor='uploadimage' className='flex items-center px-3 p-2 gap-3 hover:bg-slate-200 cursor-pointer'>
                <div className='text-primary'>
                  <FaRegImage size={18}/>
                </div>
                <p>Image</p>
              </label >
              <label htmlFor='uploadvideo' className='flex items-center px-3 p-2 gap-3 hover:bg-slate-200 cursor-pointer'>
                <div className='text-purple-500'>
                  <FaVideo size={18}/>
                </div>
                <p>video</p>
              </label>
              <input type='file'  id='uploadimage' onChange={handleImage} className='hidden'/>
              <input type='file'  id='uploadvideo' onChange={handleVideo} className='hidden'/>
            </form>
          </div>
          )}
          </div>
          {/*input message*/}
          <form className='w-full h-full flex justify-between items-center' onSubmit={handleSubmit}>
              <input type='text' value={message.text}  className='w-full h-full outline-none py-2 px-4' 
               placeholder='Type a message...' onChange={handleOnChange}   />
               <button type='submit' className='text-primary px-2 '>
                  <IoSendSharp size={25}/>
                 </button>
          </form>
      </section> 
    </div>
  )
}

export default MessagePage