import React, { useState } from 'react'
import LoginPage from  '../pages/LoginPage'
import { useNavigate } from 'react-router-dom';




function Login() {

  const navigate=useNavigate();
 
  return (
    <div className='flex gap-3'>
<button type="button" onClick={()=>{navigate('/login',)}} className=" px-6 py-3  text-black text-lg font-semibold ">
  Login
</button> <button type="button" onClick={()=>{navigate('/register')}} className=" px-6 py-3 bg-[black] text-gray-200 text-lg font-semibold rounded-full shadow-lg hover:scale-3d transition-all duration-300 ease-in-out hover:scale-105">
  Register
</button>
</div>
  )
}

export default Login