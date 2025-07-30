import React, { useEffect,useState } from 'react';
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RiHotelBedLine } from "react-icons/ri";
import { BiUserCircle } from "react-icons/bi";
import { LiaRupeeSignSolid } from "react-icons/lia";
import axios from 'axios'
import {toast} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


function RoomBookingDetails() {
const navigate=useNavigate();
  const [bookingStatus,setBookingStatus]=useState('Unconfirmed');
  const rawUser = JSON.parse(localStorage.getItem('user'));
const room = JSON.parse(localStorage.getItem('room'));
const booking = JSON.parse(localStorage.getItem('booking'));
 // Step 1: Parse the dates from strings to Date objects
const checkin = new Date(booking.checkInDate);
const checkout = new Date(booking.checkOutDate);

// Step 2: Calculate the difference in milliseconds
const diffInMs = checkout - checkin;

// Step 3: Convert milliseconds to days
const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  

const handleNewBooking = async () => {
const payload = {
    roomId: room._id,
    userId: rawUser.user._id,
    checkIn: new Date(booking.checkInDate),
    checkOut: new Date(booking.checkOutDate),
    guests: booking.maxguests,
    totalAmount: room.pricePerNight * diffInDays,
    bookingStatus: "confirmed",
  };

  const submitBooking = async () => {
    return await axios.post(
      'http://localhost:8000/api/users/newbooking',
      payload,
      { withCredentials: true }
    );
  };

  try {
    await submitBooking();
    setBookingStatus("Confirmed");
    toast.success('Booking Created Successfully');
    navigate('/profile/currenttrips', { replace: true });
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      try {
        console.warn("Access token expired. Attempting refresh...");
        await axios.get('http://localhost:8000/api/auth/refresh-token', {
          withCredentials: true,
        });

        // Retry booking once after refreshing token
        await submitBooking();
        setBookingStatus("Confirmed");
        toast.success('Booking Created Successfully');
        navigate('/profile', { replace: true });
      } catch (refreshError) {
        console.error("Token refresh failed or second booking attempt failed", refreshError);
        toast.error("Session expired. Please login again.");
      }
    } else {
      console.error("Error registering this booking", error);
      toast.error(message || "Booking failed. Please try again.");
    }
  }
};




  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-100 px-4 my-[-3rem] md:p-16 font-sans text-gray-900">
      {/* Heading */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-10 text-pink-700 drop-shadow-sm">
          The Room is Available 
        </h1>

        <div className="space-y-8">
          {/* Room Info */}
          <section className="bg-gradient-to-r from-white via-rose-50 to-white border border-rose-200 rounded-xl p-6 shadow-md">
            <h2 className="flex items-center text-xl font-semibold mb-4 text-rose-600">
              <MdOutlineBedroomParent className="text-2xl text-rose-400 mr-2" />
              Room Information
            </h2>
            <ul className="space-y-1 text-gray-800">
              <li>
                <span className="font-medium text-gray-900">Room Name:</span> {room.name}
              </li>
              <li>
                <span className="font-medium text-gray-900">Location:</span>{" "}
                <FaMapMarkerAlt className="inline mr-1 text-red-500" />
                {room.address}, {room.city}
              </li>
              <li>
                <span className="font-medium text-gray-900">Room ID:</span>{" "}
                <code className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                  {room._id}
                </code>
              </li>
            </ul>
          </section>

          {/* Booking Info */}
          <section className="bg-gradient-to-r from-white via-sky-50 to-white border border-sky-200 rounded-xl p-6 shadow-md">
            <h2 className="flex items-center text-xl font-semibold mb-4 text-sky-600">
              <RiHotelBedLine className="text-2xl text-sky-400 mr-2" />
              Booking Details
            </h2>
            <ul className="space-y-1 text-gray-800">
              <li>
                <span className="font-medium text-gray-900">Check-in Date:</span> {booking.checkInDate}
              </li>
              <li>
                <span className="font-medium text-gray-900">Check-out Date:</span> {booking.checkOutDate}
              </li>
              <li>
                <span className="font-medium text-gray-900"> Name:</span>{" "}
                <BiUserCircle className="inline text-purple-500 mr-1" />
               {rawUser.user.fullname.charAt(0).toUpperCase()+rawUser.user.fullname.slice(1)}
              </li>
              <li>
                <span className="font-medium text-gray-900">Guests:</span> {booking.maxguests} Guests
              </li>
              <li>
                <span className="font-medium text-gray-900">No. of Days:</span> {diffInDays} Days
              </li>
               <li>
                <span className="font-medium text-gray-900">TotalPrice:</span> <LiaRupeeSignSolid className='inline'/>{room.pricePerNight * diffInDays} 

              </li>
            </ul>
          </section>

          {/* Booking Status */}
          <section className="bg-gradient-to-r from-white via-green-50 to-white border border-green-200 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              Booking Status
            </h2>
            <p className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              {bookingStatus}
            </p>
          </section>
                    {/* Confirm Booking Button */}
          {bookingStatus==='Unconfirmed' ? <section className='flex justify-center'>
            
            <button
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              onClick={handleNewBooking}
            >
              Confirm Booking
            </button>
          </section> :
          
          <section className='flex justify-center'>
          <p >The Booking should now be visible on your Bookings Profile</p>
          </section>
          }

        </div>
      </div>
    </div>
  );
}

export default RoomBookingDetails;
