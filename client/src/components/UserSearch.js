import React, { useEffect, useState } from 'react'
import { RiUserSearchFill } from "react-icons/ri";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast'
import axios from 'axios'
import { SummaryApi } from '../commanApi/commanApi';
import { IoCloseCircleOutline } from "react-icons/io5";



const UserSearch = ({onClose}) => {
    const [searchUser,setSearchUser] = useState([])
    const[loading ,setLoading] =useState(false)
    const[search ,setSearch] = useState("")

    const handleSearch= async()=>{
        try {
            setLoading(true)
            const response = await axios.post(SummaryApi.searchUser.url,
            {search:search})
            setLoading(false)
            setSearchUser(response.data.data)
            
        } catch (error) {
            toast.error(error.response.data.message ||"error")    
        }
    }

    useEffect(()=>{
        handleSearch()
    },[search])

    console.log("searchUser",searchUser)

  return (
    <div className='fixed bottom-0 right-0 left-0 top-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
        <div className='w-full max-w-md mx-auto mt-10 m-1'>
            {/*input search */}
        <div className='bg-white  rounded h-14 overflow-hidden flex'>
            <input type='text' placeholder='search by name,email'
             className='w-full outline-none py-1 h-full px-4 ' onChange={(e)=>setSearch(e.target.value)} value={search}/>
            <div className='h-14 w-14 flex justify-center items-center border-l border-gray-300'>
                {
                    search.length !==0 ?(
                        <div onClick={onClose}>
                         <IoCloseCircleOutline size={25} color='red'/>
                        </div> 

                    ):
                     <RiUserSearchFill size={25} color='gray' />
                }
            </div>
        </div>
        {/* display user name*/}
        <div className='bg-white mt-2 w-full p-4'>
            {/* no user */}
            {
                searchUser.length === 0 && !loading &&(
                    <p className='text-center text-slate-500'> no user  found!</p>
                )
            }
            {
                loading &&(
                    <Loading/>
                )
            }
             {
                searchUser.length !== 0 && !loading &&(
                    searchUser.map((user,index)=>{
                        return(
                            <UserSearchCard key={user._id} user={user} onClose={onClose}/>
                        )
                    })
                )
            }
        </div>
        </div>
       
    </div>
  )
}

export default UserSearch