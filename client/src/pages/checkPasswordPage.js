import React, { useState,useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios'
import { SummaryApi } from '../commanApi/commanApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';


const CheckPasswordPage = () => {
  
  const[data,setData] = useState({
    password : "",
    userId : "" 
  });

const navigate = useNavigate()
const location = useLocation()
const dispatch = useDispatch()

console.log('location ',location.state );

useEffect(()=>{
if(!location?.state?.name){
  navigate('/verify-email')
}
},[])


const handleOnChange = (e)=>{
  const {name,value} = e.target
  setData((prev) =>{
    return{
      ...prev,
      [name]: value
      }
  })
}

const handleSubmit = async(e)=>{
  e.preventDefault() 
  e.stopPropagation()
  try {
    const response = await axios.post(SummaryApi.verifyPassword.url,{
      userId : location?.state?._id,
      password : data.password
    },{withCredentials:'include'})

    if (response.data.success) {  
      dispatch(setToken(response?.data?.token))
      localStorage.setItem('token',response?.data?.token)
      setData({  
         password: "",
      })
      toast.success(response?.data?.msg)
      navigate("/")
    }
    else{
      toast.error(response?.data?.msg)
    }
  }
    catch (error) {
    console.log(error);
  } 
}


  return (
    <div className='mt-5'>
        <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
          <div className='w-fit mx-auto mb-2 flex flex-col items-center justify-center gap-1'>
            {/* <PiUserCircleDashedDuotone size={80} color='green'/> */}
            <Avatar width={70} height={70} name={location.state?.name} 
            imageUrl={location.state?.profilePic}
            />
            <h2 className='text-center font-semibold text-gray-500 capitalize'>{location.state?.name}</h2>
            <h3 className='font-semibold'>Hello Again !</h3>
          </div>

          <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>

          <div className='flex flex-col gap-1'>
                <label htmlFor='password'>Password :</label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  placeholder='enter your password' 
                  className='bg-slate-100 px-2 py-1 focus:outline-primary'
                  value={data.password}
                  onChange={handleOnChange}
                  required
                />
              </div>

              <button
               className='bg-primary text-lg  px-4 py-1 hover:bg-green-600 rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
              >
               Let's Go
              </button>

          </form>

          <p className='my-3 text-center'>New User? <Link to={"/register"} className='hover:text-primary font-semibold'>register</Link></p>
        </div>
    </div>
  )
}

export default CheckPasswordPage



// export default CheckPasswordPage