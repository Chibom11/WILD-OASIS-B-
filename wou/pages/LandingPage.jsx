import { useEffect, useRef } from 'react';
import NavBar from '../components/NavBar';
import FlipText from '../effects/FlipText'
import '../src/App.css';
import {easeOut, motion} from 'framer-motion'
import { replace, useNavigate } from 'react-router-dom';



function LandingPage() {
 const navigate=useNavigate();


  return (
    <>
     <NavBar />
  
     
<section className="relative h-screen w-full overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
    <img src="./bimg.jpg" alt="background" className="h-full w-full object-cover brightness-75" />
    <div className="absolute inset-0 bg-black/30 z-10"></div> {/* Dark overlay for text contrast */}
  </div>

  {/* Heading and subheading text */}
  <div className="absolute top-1/3 w-full text-center z-20 px-6">
    <motion.h1
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="text-white text-5xl font-bold drop-shadow-lg"
    >
      Escape to Nature
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="text-white text-xl mt-4 drop-shadow-sm"
    >
      Cozy cabins nestled in tranquil forests
    </motion.p>
  </div>

  {/* Explore Button */}
  <motion.div
    animate={{ y: '-200%' }}
    transition={{ delay: 0.8, duration: 1, ease: 'easeInOut' }}
    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40"
  >
    <button
      onClick={() => navigate('/login',{replace:true})}
      className="px-6 py-3 bg-white text-black text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:scale-105"
    >
      Explore
    </button>
  </motion.div>
</section>

{/* <section className='w-full h-screen bg-blue-400 py-10 px-6'>
  <h2 className='text-4xl font-bold text-white text-center mb-10'>
    Discover Our Beautiful Cabins
  </h2>

  <div className='flex justify-center gap-10'>
    <div className='space-y-4'>
      <img src="./imgs/cabin1.jpg" className='h-[250px] w-[300px] object-cover rounded-lg' />
      <img src="./imgs/cabin2.jpg" className='h-[250px] w-[300px] object-cover rounded-lg'/>
      <img src="./imgs/cabin3.jpg" className='h-[250px] w-[300px] object-cover rounded-lg'/>
    </div>
    <div className='space-y-4'>
      <img src="./imgs/cabin4.jpg" className='h-[250px] w-[300px] object-cover rounded-lg'/>
      <img src="./imgs/cabin5.webp" className='h-[250px] w-[300px] object-cover rounded-lg'/>
      <img src="./imgs/cabin6.webp" className='h-[250px] w-[300px] object-cover rounded-lg'/>
    </div>
  </div>
</section> */}




    </>
  );
}




export default LandingPage

{/* <motion.div

className="relative top-[-200px] left-[-20px] z-40 flex items-center h-full pl-16">
  <div className="text-white text-left">
    <div className="cursor-pointer text-8xl font-bold leading-tight">
   
<FlipText 
text="ESCAPE " 
color1="text-black" 
color2="text-white"
/>
<span className='text-[#D6D9E0]'>. UNWIND</span><br />
<span className=' animate-typing text-white'>Reconnect</span>
<motion.div 
initial="initial"

className="relative inline-block"
>
{[".",".","."].map((text,index)=>(
<motion.span
  className="inline-block font-extrabold text-white  tracking-whwide"
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
 */}
{/* Gradient overlay */}
{/* <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-300  opacity-20 z-1   w-[50%]"></div> */}
// <>
// <NavBar/>
// <Canvas className='absolute top-0 left-0 w-full h-screen'>
//   <OrbitControls/>
//   <Environment files='/hdris/brown_photostudio_02_4k.hdr' background/>
// </Canvas>
// </>