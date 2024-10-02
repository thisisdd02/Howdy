import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { SummaryApi } from '../commanApi/commanApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PiUserCircleDashedDuotone } from "react-icons/pi";


const CheckEmailPage = () => {
  
  const[data,setData] = useState({
    email: "",
});

const navigate = useNavigate()

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
    const response = await axios.post(SummaryApi.verifyEmail.url,data)
    if (response.data.success) {
      setData({  
          email: "",
      })
      toast.success(response?.data?.msg)
      navigate("/verify-password",{
        state : response?.data?.data
      })
    }
    else{
      toast.error(response?.data?.msg)
    }
  } catch (error) {
    console.log(error);
  } 
}

  return (
    <div className='mt-5'>
        <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
          <div className='w-fit mx-auto mb-2 flex flex-col justify-center items-center gap-1'>
            <PiUserCircleDashedDuotone size={80} color='green'/>
            <h3 className='font-semibold'>LET ME KNOW!</h3>
            </div>
         

          <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>

              <div className='flex flex-col gap-1'>
                <label htmlFor='email'>Email :</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  placeholder='enter your email' 
                  className='bg-slate-100 px-2 py-1 focus:outline-primary'
                  value={data.email}
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

export default CheckEmailPage

// export default CheckEmailPage