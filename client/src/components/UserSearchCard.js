import React from 'react'
import Avatar from './Avatar'
import {Link} from 'react-router-dom'

const UserSearchCard = ({user,onClose}) => {
  return (
    <Link to={'/'+user?._id} onClick={onClose} className='flex items-center gap-3 p-2 lg:p-4 border rounded-2xl mt-2 hover:border-primary'>
         <div>
            <Avatar width={50} height={50} name={user?.name} imageUrl={user.profilePic} userId={user?._id}/>
         </div>
         <div> 
            <div className='font-semibold text-ellipsis line-clamp-1'>{user?.name}</div>
            <p className=' text-sm text-slate-500 text-ellipsis line-clamp-1'>{user?.email}</p>
         </div>
    </Link>
  )
}

export default UserSearchCard