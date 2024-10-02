import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import axios from "axios"
import { SummaryApi } from '../commanApi/commanApi'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo-2.png'
import io from 'socket.io-client'


const Home = () => {

  const user = useSelector(state => state.user)

  console.log(' redux user', user);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location= useLocation()
  
  console.log('user',user)
  const fetchUserDetail = async()=>{
    try {
      const response = await axios.get(SummaryApi.userDetails.url,{withCredentials:'include'})

      dispatch(setUser(response.data.user))

     if(response?.data?.user?.logout){
      dispatch(logout())
      navigate('/verify-email')
     }
     console.log('currentUser',response.data);
    } catch (error) {
      console.log(error);
    } 
  }

  useEffect(()=>{
    fetchUserDetail()
  },[])

  /* socket-connection */
  useEffect(()=>{
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
      auth:{
        token: localStorage.getItem('token')
      }
    })
    socketConnection.on('onlineUser', (data) => {
      console.log(data);
      dispatch(setOnlineUser(data))
    })
    dispatch(setSocketConnection(socketConnection))

    return ()=>{
      socketConnection.disconnect() 
    }

  },[])


  const basePath = location.pathname === '/'

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen '> 
      <section className={`bg-white ${!basePath && 'hidden'} lg:block`}>
         <Sidebar/>
      </section>

      <section className={`${basePath && 'hidden'}`}>
         <Outlet/>
      </section>
    
      <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex" }`}>
            <div>
              <img
                src={logo}
                width={250}
                alt='logo'/>
            </div>
           <p className='text-lg mt-2 text-slate-500'> select user to send message </p>
        </div>    
    </div> 
  ) 
}

export default Home