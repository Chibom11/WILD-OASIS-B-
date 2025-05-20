import { useEffect, useRef } from 'react';
import NavBar from '../components/NavBar';
import FlipText from '../effects/FlipText'
import '../src/App.css';
import {easeOut, motion} from 'framer-motion'
import { ReactLenis,useLenis } from 'lenis/react'




function HomePage() {
 

  return (
    <>
     <NavBar />
  
     
<section className="relative h-screen w-full overflow-hidden">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-95 h-full"
   
  >
    <img src='./bimg.jpg'  ></img>
    <div className="absolute inset-0 bg-black/20 z-10"></div>
  </div>

  {/* Optional dark overlay for contrast */}
  

  {/* Text on the left */}
  <motion.div
 
  className="relative top-[-200px] left-[-20px] z-40 flex items-center h-full pl-16">
    <div className="text-white text-left">
      <div className="cursor-pointer text-8xl font-bold leading-tight">
  <FlipText 
  text="ESCAPE " 
  color1="text-black" 
  color2="text-white"
/>
  <span className='text-black'>. Unwind</span><br />
  <span className=' animate-typing '>Reconnect</span>
 <motion.div 
  initial="initial"
  
  className="relative inline-block"
>
  {[".",".","."].map((text,index)=>(
  <motion.span
    className="inline-block "
    variants={{
      initial: { y: 0, opacity: 1 },
      
    }}
    whileHover={ {y: "-10%", opacity: 0} }
    transition={{
      duration: 0.1,
      ease: "easeInOut",
       delay: index * 0.1,
    }}
    key={index}
  >
      { text}
  </motion.span>))}
</motion.div>
</div>
    </div>
  </motion.div>

  {/* Explore button centered at bottom */}
  <motion.div 
  animate={{y:'-200%'}}
  transition={{ delay: 0.8, duration:1,ease:'easeInOut'}}
  className="absolute bottom-4 left-1/2 transform-translate-x-1/2 z-40">
    <button className="px-6 py-3 bg-black text-white text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:scale-105">
      Explore
    </button>
  </motion.div>
</section>

<section className='w-full h-screen bg-blue-400'>
<div className='flex '>
<div>
  <img src="./imgs/cabin1.jpg" className='h-[250px] w-[300px]' />
  <img src="./imgs/cabin2.jpg" className='h-[250px] w-[300px]'/>
  <img src="./imgs/cabin3.jpg" className='h-[250px] w-[300px]'/>
  </div>
  <div>
<img src="./imgs/cabin4.jpg" className='h-[250px] w-[300px]'/>
<img src="./imgs/cabin5.webp" className='h-[250px] w-[300px]'/>
<img src="./imgs/cabin6.webp" className='h-[250px] w-[300px]'/>
</div>
</div>
</section>



    </>
  );
}




export default HomePage

{/* Gradient overlay */}
{/* <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-300  opacity-20 z-1   w-[50%]"></div> */}
// <>
// <NavBar/>
// <Canvas className='absolute top-0 left-0 w-full h-screen'>
//   <OrbitControls/>
//   <Environment files='/hdris/brown_photostudio_02_4k.hdr' background/>
// </Canvas>
// </>