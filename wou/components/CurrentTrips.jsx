import React from 'react';
import {useState,useEffect}  from 'react'
import axios from 'axios'

import { useOutletContext } from 'react-router-dom';


const CurrentTrips = () => {
  const today=new Date();
  console.log(today)
   const {activeTab,setActiveTab } = useOutletContext();
    const [currenttrips,setCurrentTrips]=useState([]);
 useEffect(() => {
  setActiveTab('Current Trips'); // Set the active tab to 'Current Trips'
  const getCurrentTrips = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/users/currenttrips', {
      withCredentials: true,
    });

    const trips = res.data?.data || []; // safe fallback
    console.log(trips[0].checkOut)
    const filteredTrips=trips.filter((t)=>{ return new Date(t.checkOut)>today})
    console.log(filteredTrips)
   
    setCurrentTrips(filteredTrips);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      console.warn("Access token expired, attempting to refresh...");

      try {
        await axios.get('http://localhost:8000/api/auth/refresh-token', {
          withCredentials: true,
        });

        const retryRes = await axios.get('http://localhost:8000/api/users/currenttrips', {
          withCredentials: true,
        });

        const trips = retryRes.data?.data || [];
        const filteredTrips=trips.filter((t)=>{ return new Date(t.checkOut)>today})
        setCurrentTrips(filteredTrips);
      } catch (refreshErr) {
        console.error("Token refresh failed:", refreshErr);
        setCurrentTrips([]); // fallback to empty
      }
    } else {
      console.error("Failed to fetch current trips:", err.message);
      setCurrentTrips([]); // fallback to empty
    }
  }
};

  getCurrentTrips();
}, []);


const handleCancellation=async(booking)=>{
  
  console.log(booking);
 try {
   await axios.post('http://localhost:8000/api/users/cancelbooking',
     {bookingId:booking._id}, {withCredentials:true}
   )
   toast.success("Booking cancelled successfully")
    setCurrentTrips((prevTrips) =>
      prevTrips.filter((trip) => trip._id !== booking._id)
    );
 
 } catch (error) {
  console.error(error?.response?.message);
  toast.error("Error deleting Booking")
  
 }
}
const handlePayment = async (booking) => {
  try {
    const resone = await axios.get('http://localhost:8000/api/getkey');

    const restwo = await axios.post(
      'http://localhost:8000/api/users/checkout',
      { amount: booking.totalAmount*100 }, // amount in paise
      { withCredentials: true }
    );

    const options = {
      key: resone.data.key,
      amount: booking.totalAmount*100,
      currency: "INR",
      name: "The Wild Oasis",
      description: "Booking Payment",
      image: '/logo.png',
      order_id: restwo.data.order.id,

      // ✅ handle success manually
      handler: async function (response) {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

        try {
          await axios.post(
            "http://localhost:8000/api/users/paymentverification",
            {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              bookingId: booking._id, // ✅ pass this from current trip
              paymentMethod: "upi",   // or "card", depending on UI or method detection
            },
            { withCredentials: true }
          );

          
           window.location.href = '/profile/pasttrips';
        } catch (error) {
          console.error("Payment verification failed:", error);
        
          window.location.href='/profile/currenttrips'
        }
      },

      prefill: {
        name: "Shivam",
        email: "shivam.surroach@example.com",
        contact: "9000090000"
      },

      method: {
        netbanking: true,
        card: true,
        upi: true,
        wallet: true
      },

      notes: {
        address: "Razorpay Corporate Office"
      },
      theme: {
        color: "#e137dc"
      }
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (error) {
    console.error("Payment error:", error);
    toast.error("Payment failed. Try again.");
  }
};


  
  return (
    <>
   {currenttrips.length!==0 ?
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Current Trips</h1>

      <div className="space-y-6">
        {currenttrips.map((trip) => (
          <div
            key={trip._id}
            className="w-full flex bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={trip.room.cabin_img[0]}
              alt={trip.room.name}
              className="w-60 h-44 object-cover"
            />

            <div className="p-5 w-full relative">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {trip.room.name}
              </h2>
            <p className="text-gray-600">
            <span className="font-medium">Check-in:</span>{" "}
            {new Date(trip.checkIn).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })}
            </p>
            <p className="text-gray-600 mb-3">
            <span className="font-medium">Check-out:</span>{" "}
            {new Date(trip.checkOut).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })}
            </p>

            <div className='flex justify-end gap-[10px]'>
              <button className="  text-gray-600  font-semibold py-2 px-4 rounded-xl shadow transition-all duration-200"
              onClick={()=>handleCancellation(trip)}
              >
                Cancel
              </button>
               <button className="  bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-xl shadow transition-all duration-200"
               onClick={()=>handlePayment(trip)}>
                Pay Now
              </button>
              
            </div>
            </div>
          </div>
        ))}
        <p>Total : {currenttrips.length}</p>
      </div>
    </div>: <p>Nothing to display here</p>}
    </> 
  );
};

export default CurrentTrips;
