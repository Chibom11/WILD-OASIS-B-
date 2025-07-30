import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

const PastTrips = () => {
   const {activeTab,setActiveTab } = useOutletContext();
   const [pastTrips,setPastTrips]=useState([]);
 useEffect(() => {
  setActiveTab('Past trips'); 
  const getPastTrips = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/users/pasttrips', {
      withCredentials: true,
    });

    const trips = res.data?.data || []; // safe fallback
    console.log(trips)
    setPastTrips(trips);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      console.warn("Access token expired, attempting to refresh...");

      try {
        await axios.get('http://localhost:8000/api/auth/refresh-token', {
          withCredentials: true,// ensure cookies are sent
        });

        const retryRes = await axios.get('http://localhost:8000/api/users/pasttrips', {
          withCredentials: true,
        });

        const trips = retryRes.data?.data || [];
        setPastTrips(trips);
      } catch (refreshErr) {
        console.error("Token refresh failed:", refreshErr);
        setPastTrips([]); // fallback to empty
      }
    } else {
      console.error("Failed to fetch past trips:", err.response);
      setPastTrips([]); // fallback to empty
    }
  }
};

  getPastTrips();
}, []);

  return (
    <>
    {pastTrips.length!==0 ? <div className="p-8 bg-gray-50 min-h-screen w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Paid Trips</h1>

      <div className="space-y-6">
        {pastTrips.map((trip) => (
          <div
            key={trip._id}
            className="w-full flex bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={trip.room.cabin_img}
              alt={trip.room.name}
              className="w-60 h-44 object-cover"
            />

            <div className="p-5 w-full relative">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {trip.room.name}
              </h2>
              <p className="text-gray-600 mb-3">
                <span className="font-medium">Check Out Date : </span>  {new Date(trip.checkOut).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })}
              </p>

              <button
                className="absolute bottom-5 right-5 bg-gray-300 text-gray-600 font-semibold py-2 px-4 rounded-xl cursor-not-allowed"
                disabled
              >
                Paid
              </button>
            </div>
          </div>
        ))}
      </div>
    </div> : <p>Nothing to display here</p>}
    </>
  );
};

export default PastTrips;
