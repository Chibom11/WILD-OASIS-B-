import React from 'react'
import { useOutletContext,useNavigate } from 'react-router-dom';

function AboutMe() {
     // Dummy user data for the profile card
     const { showUpdate, setShowUpdate,activeTab,setActiveTab } = useOutletContext();
      const navigate = useNavigate();
      const rawuser = JSON.parse(localStorage.getItem("user")) ;
      const user=rawuser.user;
      const userData = {
        initial: user.username.slice(0,2), // First letter of the user's name
        name: user.username,
        role: user.role
      };
      console.log(userData.role)
  return (
    
    <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">About me</h2>
            <button
            onClick={() => setShowUpdate(true)}
            className="text-gray-600 text-lg hover:underline"
          >
              Edit
            </button>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-5xl font-bold mb-4">
                {userData.initial}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">{userData.name}</h3>
              <p className="text-gray-600">{userData.role}</p>
            </div>

           
            {user.role==='host' ?  <div className="mt-8 p-6 bg-white rounded-2xl shadow-md border border-gray-100 max-w-xl">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  You're currently registered as a host
                </h2>
                <p className="text-gray-600 mb-6">
                  Start by listing a room to make it available for bookings. You can also manage your existing listings and check your earnings from the dashboard.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate("/host/add-room")}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-lg shadow transition "
                  >
                    Add Room
                  </button>
                  <button
                    onClick={() => navigate("/host/dashboard")}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-lg shadow-sm transition font-medium"
                  >
                    View Dashboard
                  </button>
                </div>
              </div> :   <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Become a Host</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  You are currently registered as a guest. To become a host, please click below to complete your profile and start hosting guests.
                </p>
              </div>
              <button className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-200 shadow-md" onClick={()=>navigate('/createhostprofile')}>
                Get started
              </button>
            </div> }
          </div>

          {/* Reviews I've written Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h10m-9 4h4m-4 2h4M7 6h10M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"></path>
              </svg>
              <span>Reviews I've written</span>
            </h3>
            {/* Add review content here if available */}
            <p className="text-gray-500 mt-4">No reviews written yet.</p>
          </div>
        </div>
  )
}

export default AboutMe