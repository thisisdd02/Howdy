import React from 'react'
import logo from '../assets/logo-1.png'

const AuthLayout = ({ children }) => {
    return (
        <>
            <header className='flex items-center justify-center h-20 shadow-md bg-white'>
                <img src={logo} alt='' width={180} height={60}   />
            </header>
            
            {children}

        </>
    )
}

export default AuthLayout