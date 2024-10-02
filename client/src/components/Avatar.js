import React from 'react'
import { PiUserCircleDashedDuotone } from "react-icons/pi";
import {useSelector} from 'react-redux'


const Avatar = ({userId,name,imageUrl,width,height}) => {
  const onlineUser = useSelector(state=>state?.user?.onlineUser)
    let avatarName= ""

    if(name){
        const splitName = name?.split(" ")
  
        if(splitName.length > 1){
          avatarName = splitName[0][0].toUpperCase()+splitName[1][0].toUpperCase()
        }else{
          avatarName = splitName[0][0].toUpperCase()
        }
      }
    const bgColor =[ 
    'bg-slate-200',
      'bg-teal-200',
      'bg-red-200',
      'bg-green-200',
      'bg-yellow-200',
      'bg-gray-200',
      "bg-cyan-200",
      "bg-sky-200",
      "bg-blue-200",
      "bg-indigo-200",
      "bg-purple-200",
      "bg-pink-200",
      "bg-orange-200",
      "bg-amber-200",
      "bg-lime-200",
      "bg-fuchsia-200",
      "bg-emerald-200",
      "bg-violet-200",
      "bg-rose-200",
      ]

      const randomNumber = Math.floor(Math.random() * 9)

      const isOnline = onlineUser.includes(userId)


  return (
    <div className={`text-slate-800  rounded-full font-bold relative`} style={{width : width+"px", height : height+"px" }}>
        {
            imageUrl ? (
              <div style={{width : width+"px", height : height+"px" }} className={`overflow-hidden rounded flex justify-center items-center text-lg `}>
                <img
                    src={imageUrl}
                    width={width}
                    height={height}
                    alt={name}
                    className='overflow-hidden rounded-full'
                />
              </div>
            ) : (
                name ? (
                    <div  style={{width : width+"px", height : height+"px" }} className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColor[randomNumber]}`}>
                        {avatarName}
                    </div>
                ) :(
                  <PiUserCircleDashedDuotone
                    size={width}
                    color='green'
                  />
                )
            )
        }
        {
          isOnline&&(
            <div className='bg-green-500 p-1 absolute bottom-2 right-0 z-10 rounded-full '></div>
          )
        }  
    </div>
  )
}

export default Avatar