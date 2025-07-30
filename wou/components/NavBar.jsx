import React from 'react'
import Logo from './Logo'
import Login from './Login'
import  { motion} from 'framer-motion'
import { useState,useRef } from 'react'

export default function NavBar() {
  const [position,setPosition]=useState({
    left:0,
    width:0,
    opacity:1
  })
  return (
    <nav className=" sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-gray-200 shadow" >
      <Logo />
      <ul className="ml-[200px] relative flex rounded-full border-2 border-black gap-[26px] p-1 " onMouseLeave={()=>{setPosition((pv)=>({...pv,opacity:0}))}}>
        <Tab  setPosition={setPosition}>About Us</Tab>
        <Tab setPosition={setPosition}>Service</Tab>
        <Tab setPosition={setPosition}>Features</Tab>
        <Tab setPosition={setPosition}>Pricing</Tab>
        <Cursor position={position}/>
      </ul>
      <Login />
    </nav>
  );
}

function Tab({children,setPosition}){
  const ref=useRef(null);
  return (
    <li
    ref={ref}
    onMouseEnter={()=>{
      if(!ref.current)return
      const {width}=ref.current.getBoundingClientRect();
      setPosition({
        width,
        opacity:1,
        left:ref.current.offsetLeft,
      })
    }}
    className='relative z-10  cursor-pointer px-3 py-1.5 text-x5  text-white mix-blend-difference ' >
      {children}
    </li>
  )
}

function Cursor({position}){
 return (
  <motion.li
  animate={position}
  className=' absolute bg-black z-0 h-10  rounded-full mt-[-2.2px] ml-[-1px] '>
  </motion.li>
 )
}