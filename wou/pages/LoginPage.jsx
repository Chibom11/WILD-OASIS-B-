import axios from 'axios'
import toast from 'react-hot-toast'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function LoginPage() {
  const navigate=useNavigate();
  const [username,setuserName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  
  const handleUserName=(e)=>{
     setuserName(e.target.value)
  }
  const handleEmail=(e)=>{
     setEmail(e.target.value)
  }
    const handlePassword = (e) => {setPassword(e.target.value);}

  const handleSubmit=async (e)=>{
    e.preventDefault();
    try {
      const res=await axios.post('/api/users/login',
        {
        username,email,password
        },
        {  
          withCredentials: true
        })
//When you pass a plain JavaScript object (like { username, email, password }) to axios.post(), Axios automatically:
// Converts the object to a JSON string via JSON.stringify()
// Sets the Content-Type header to 'application/json' So even if you don't write: headers: {'Content-Type': 'application/json'} its ok
        console.log("Login Successful",res.data)
       const user=res.data;
        localStorage.setItem('user',JSON.stringify(user)); //storing user data in local storage
       

       toast.success("Login Successful ");
       navigate('/cabins',{replace:true})
    } catch (error) {
      toast.error("Login Failed ");
    }

  }  

  


  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/login.jpg')" }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-transparent" />

      {/* Centered Form */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <form className="bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md" onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="username"
              onChange={handleUserName}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="email"
              onChange={handleEmail}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="password"
              onChange={handlePassword}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            
          >
            LogIn
          </button>
          <p className="mt-4 text-sm text-center">
            Not yet Registered?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage








// import React, { useRef } from 'react'
// import { Canvas, useFrame, useThree } from '@react-three/fiber'
// import { useTexture, OrbitControls } from '@react-three/drei'
// import * as THREE from 'three'

// function BackgroundPlane() {
//   const texture = useTexture('/login.jpg')

//   return (
//     <mesh position={[0, 0, -5]}>
//       <planeGeometry args={[25, 12]} />
//       <meshStandardMaterial
//         map={texture}
//         side={THREE.DoubleSide}
//         roughness={1}
//         metalness={0}
//       />
//     </mesh>
//   )
// }

// function MovingLight() {
//   const lightRef = useRef()
//   const { mouse, viewport } = useThree()

//   useFrame(() => {
//     if (lightRef.current) {
//       // Map mouse (-1 to 1) to scene coordinates
//       const x = mouse.x * viewport.width * 2
//       const y = mouse.y * viewport.height * 2
//       lightRef.current.position.set(x, y, 5) // Match the plane's Z
//     }
//   })

//   return <directionalLight ref={lightRef} intensity={2} />
// }

// function Login() {
//   return (
//     <Canvas className="absolute top-0 left-0 w-full h-full" camera={{ position: [0, 0, 5], fov: 50 }}>
//       <ambientLight intensity={0.4} />
//       <MovingLight />
//       <OrbitControls enableZoom={false} />
//       <BackgroundPlane />
//     </Canvas>
//   )
// }

// export default Login







/////////////////////////  e.target ./////////////////////////////////
// e.target is used to get a reference of the exact HTML element that triggered the event — the element where the event like onClick, onChange, onSubmit, etc. actually happened...

//eg: onChange triggers function handlepassword
// <input
// type="password"
// id="password"
// className="w-full px-4 py-2 border border-gray-300 rounded-lg focusfocus:ring-blue-50focus:outline-none"   
// placeholder="password"
// onChange={handlePassword}/>

//function handlePassword(e){setpassword(e.target.value)}...e.target means get reference of the html elemnt where handlepassword function was called..e.target.value means get the value of the input passed in the input field by the user..other ways to use e.target is 

// Get input value-->	e.target.value
// Get selected file(s)-->	e.target.files[0]
// Get element attributes-->	e.target.name, e.target.id
// Change styles-->	e.target.style.background = 'red'
// Check checkbox state-->	e.target.checked