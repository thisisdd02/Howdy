import React, { useState } from 'react'
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Link } from 'react-router-dom';
import uploadFile from '../helper/uploadFile';
import axios from 'axios'
import { SummaryApi } from '../commanApi/commanApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  
  const[data,setData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: ""
});
const [uploadProfile, setUploadProfile] = useState("");
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

const handleUpload = async(e)=>{
  const file = e.target.files[0]

    const uploadProfile = await uploadFile(file)

    setUploadProfile(file)

    setData((preve)=>{
      return{
        ...preve,
        profilePic: uploadProfile?.url
      }
    })

}


const handleClearUpload =(e)=>{
  e.stopPropagation()
  e.preventDefault()
  setUploadProfile("");
}

const handleSubmit = async(e)=>{
  e.preventDefault()
  e.stopPropagation()
  try {
    const response = await axios.post(SummaryApi.register.url,data)
    if (response.data.success) {
      setData({
          name: "",
          email: "",
          password: "",
          profilePic: ""
      })
      toast.success(response?.data?.msg)
      navigate("/verify-email")
    }
    else{
      toast.error(response?.data?.msg)
    }
  } catch (error) {
    console.log(error);
  } 
}
console.log('data:',data);

  return (
    <div className='mt-5'>
        <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
          <h3>Welcome to Chat app!</h3>

          <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
              <div className='flex flex-col gap-1'>
                <label htmlFor='name'>Name :</label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  placeholder='enter your name' 
                  className='bg-slate-100 px-2 py-1 focus:outline-primary'
                  value={data.name}
                  onChange={handleOnChange}
                  required
                />
              </div>

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

              <div className='flex flex-col gap-1'>
                <label htmlFor='profile_pic'>Photo :

                  <div className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
                      <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                        {
                          uploadProfile?.name ? uploadProfile?.name : "Upload profile photo"
                        }
                      </p>
                      {
                        uploadProfile?.name && (
                          <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUpload}>
                            <IoMdCloseCircleOutline />
                          </button>
                        )
                      }
                      
                  </div>
                
                </label>
                
                <input
                  type='file'
                  id='profile_pic'
                  name='profile_pic'
                  className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
                  onChange={handleUpload}
                />
              </div>


              <button
               className='bg-primary text-lg  px-4 py-1 hover:bg-green-600 rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
              >
                Register
              </button>

          </form>

          <p className='my-3 text-center'>Already have account ? <Link to={"/email"} className='hover:text-primary font-semibold'>Login</Link></p>
        </div>
    </div>
  )
}

export default RegisterPage