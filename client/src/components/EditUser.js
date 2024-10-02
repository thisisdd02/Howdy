import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import uploadFile from '../helper/uploadFile'
import Divider from './Divider'
import axios from 'axios'
import { SummaryApi } from '../commanApi/commanApi'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'
import {useNavigate} from 'react-router-dom'

const EditUser = ({onClose,data}) => {

    const [userData,setUserData] = useState({
        name:data?.name,
        profilePic:data?.profilePic
    })
    const navigate = useNavigate()

    const uploadProfileRef = useRef()
    const dispatch = useDispatch()
    console.log('dispatch Edit',dispatch)

    useEffect(()=>{
        setUserData((preve)=>{
            return{
                ...preve,
                ...data
            }
        })
    },[data])
   const handleOpenProfile =(e)=>{
         e.preventDefault()
         e.stopPropagation()
        uploadProfileRef.current.click()
   }
    
    const handleInputChange = (e) => {
        setUserData({...userData,[e.target.name]:e.target.value})
    }
    const handleUpload = async(e)=>{
        const file = e.target.files[0]
      
          const uploadProfile = await uploadFile(file)
          setUserData((preve)=>{
            return{
              ...preve,
              profilePic: uploadProfile?.url
            }
          })
      
      }
      const handleSubmit =async(e)=>{  
        e.preventDefault()
        e.stopPropagation()

        try {
            const response =  await axios.post(SummaryApi.updateUser.url,userData,{withCredentials:'include'})
            console.log(response.data)
            toast.success(response.data.msg)
            if(response.data.success){
                dispatch(setUser(response?.data?.data))
                onClose()
            }
            else{
                toast.error(response.data.msg)
            }
        } catch (error) {
            console.log(error)
        }

      }
  return (
    <div className='fixed top-0 right-0 bottom-0 left-0 bg-slate-600 bg-opacity-40 flex justify-center items-center z-10'>
        <div className='bg-white p-4 m-1 rounded w-full max-w-sm'>
            <h2 className='font-semibold'> Profile Detail</h2>
            <p className='text-sm'> Edit User Detail</p>
            <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-1 '>
                <label htmlFor='name'>Name : </label>
                <input type='text' id='name' name='name' value={userData.name} onChange={handleInputChange} 
                 className='w-full py-1 px-2 focus:outline-primary border-2'/>
                </div>

                <div className=''>
                    <label htmlFor="profilePic">Profile Pic : 
                    <div className='my-1 flex items-center gap-3'>
                         <Avatar width={40} height={40} imageUrl={userData?.profilePic} name={userData?.name}/>
                        <button className='font-semibold' onClick={handleOpenProfile}>Change Photo</button>
                        <input type='file' id='profilePic' className='hidden' onChange={handleUpload} ref={uploadProfileRef} />
                    </div>
                    </label>
                </div>
                <Divider/>
                <div className='flex gap-2 ml-auto mt-3'>
                    <button onClick={onClose} className='border-primary border px-4  py-1  rounded hover:bg-primary hover:text-white'>Cancel</button>
                    <button type='submit' onSubmit={handleSubmit} className='bg-primary text-white px-4  py-1 rounded border hover:bg-white hover:text-primary hover:border-primary'> Save</button>
                </div>
            </form>

            
         </div>
       
    </div>
  )
}

export default EditUser