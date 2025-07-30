import React, { useState } from 'react';
import { IoIosLogOut } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { FaUserClock } from "react-icons/fa";
import { NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Redirecting from './Redirecting';
import UpdateDetails from './UpdateDetails';
import AboutMe from '../components/AboutMe';
  import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';






function UserProfile() {
  // State for active navigation link
  const [activeTab, setActiveTab] = useState('About me');
  const [redirecting,setRedirecting] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);



  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unlisten = window.addEventListener('popstate', () => {
      if (location.pathname.startsWith('/profile')) {
        navigate('/cabins', { replace: true });
      }
    });

    return () => window.removeEventListener('popstate', unlisten);
  }, [location]);


 

async function handleLogout() {
  try {
    setRedirecting(true);

    const res = await axios.post(
      'http://localhost:8000/api/users/logout',
      {},
      { withCredentials: true }
    );

    if (res.data.success) {
      localStorage.removeItem("user");
        if (localStorage.getItem("booking")) {
            localStorage.removeItem("booking");
           }

        if (localStorage.getItem("room")) {
          localStorage.removeItem("room");
            }
        if(localStorage.getItem("hostRooms")){
          localStorage.removeItem("hostRooms");
        }    
      window.location.href = '/landingpage';
      return; // exit function
    } else {
      toast.error("Logout failed. Please try again.");
      setRedirecting(false);
    }

  } catch (err) {
    // If token expired
    if (err.response && err.response.status === 401) {
      try {
        // Refresh access token
        await axios.get('http://localhost:8000/api/auth/refresh-token', {
          withCredentials: true
        });

        // Retry logout
        const retryRes = await axios.post(
          'http://localhost:8000/api/users/logout',
          {},
          { withCredentials: true }
        );

        if (retryRes.data.success) {
          localStorage.removeItem("user");
            if (localStorage.getItem("booking")) {
            localStorage.removeItem("booking");
           }

           if (localStorage.getItem("room")) {
          localStorage.removeItem("room");
            }

          window.location.href = '/landingpage';
          return; // exit function
        } else {
          toast.error("Logout failed after retry. Please try again.");
        }
      } catch (retryError) {
        console.error("Retry logout failed:", retryError);
        toast.error("Logout failed. Please try again.");
      }
    } else {
      console.error("Logout error:", err.response?.data || err.message);
      toast.error("Error logging out.");
    }

    setRedirecting(false);
  }
}


if (redirecting) {
  return <Redirecting/>
}


  return (
    
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {showUpdate && <UpdateDetails onClose={() => setShowUpdate(false)} />}

      {/* Main Profile Content Area */}
      <div className="pt-[150px]  max-w-6xl mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Column: Navigation Sidebar */}
        <div className="md:col-span-1">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Profile</h2>
          <nav className="space-y-2">

            <NavLink to='aboutme'>
              <button
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors duration-200 ${
                activeTab === 'About me' ? 'bg-gray-100 font-semibold text-gray-900' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('About me')}
            >
              {/* Profile Icon (S) */}
              <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                A
              </div>
              <span>About me</span>
            </button>
            </NavLink>

            <NavLink to='pasttrips'>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors duration-200 ${
                activeTab === 'Past trips' ? 'bg-gray-100 font-semibold text-gray-900' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('Past trips')}
            >
              {/* Suitcase Icon */}
             <div className='flex gap-[10px]'>
                <FaHistory className=' text-2xl'/>
              <span > Paid Trips</span>
              </div>
            </button>
            </NavLink>

            <NavLink to='currenttrips'>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors duration-200 ${
                activeTab === 'Current Trips' ? 'bg-gray-100 font-semibold text-gray-900' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('Current Trips')}
            >
              {/* Suitcase Icon */}
              <div className='flex gap-[10px]'>
                <FaUserClock  className=' text-2xl'/>
                </div>
              <span > Current Trips</span>
            </button>
            </NavLink>
            <button
              className={'w-full  px-4 py-3 bg-black flex items-center space-x-3 transition-colors duration-200 hover:scale-101' }
              onClick={handleLogout}
            >
              {/* People Icon */}
              <div className='flex gap-[10px]'>
                <IoIosLogOut className='text-white text-2xl'/>
              <span className=' text-white' > Logout</span>
              </div>
            </button>
          </nav>
          
        </div>

        {/* Right Column: Profile Details & Actions */}
        <div className="md:col-span-2 w-full">
  <Outlet context={{ showUpdate, setShowUpdate ,activeTab,setActiveTab}} />
</div>
        
      </div>
    </div>
    
  );
}

export default UserProfile;
