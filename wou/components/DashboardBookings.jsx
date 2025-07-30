import React, { useContext } from 'react';
import HostContext from '../context/HostContext';

function DashboardBookings() {
  const { paidRooms,unpaidRooms } = useContext(HostContext);
 
   const today = new Date();
  const filteredPaidRooms=paidRooms.filter((b)=>{return new Date(b.checkIn)>=today})
  const filteredUnPaidRooms=unpaidRooms.filter((b)=>{return new Date(b.checkIn)>=today})
  console.log(filteredPaidRooms)
  console.log(filteredUnPaidRooms)
  return (
    <>
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-rose-600">Paid & Confirmed Bookings</h2>

      {filteredPaidRooms.length === 0 ? (
        <p className="text-gray-500">No bookings yet for your rooms.</p>
      ) : (
        <div className="space-y-4">
          {filteredPaidRooms.map((booking) => (
            <div key={booking._id} className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-bold">{booking.room.name}</h3>
              <p className="text-sm text-gray-600">
                Booked by: <span className="font-medium">{booking.user.username}</span>
              </p>
              <p className="text-sm">
                From: {new Date(booking.checkIn).toLocaleDateString()} to{' '}
                {new Date(booking.checkOut).toLocaleDateString()}
              </p>
              <p className="text-sm text-green-600 font-medium mt-1">
                ₹{booking.totalAmount} — {booking.paymentStatus}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
       <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-rose-600">Unpaid Bookings</h2>

      {filteredUnPaidRooms.length === 0 ? (
        <p className="text-gray-500">No bookings yet for your rooms.</p>
      ) : (
        <div className="space-y-4">
          {filteredUnPaidRooms.map((booking) => (
            <div key={booking._id} className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-bold">{booking.room.name}</h3>
              <p className="text-sm text-gray-600">
                Booked by: <span className="font-medium">{booking.user.username}</span>
              </p>
              <p className="text-sm">
                From: {new Date(booking.checkIn).toLocaleDateString()} to{' '}
                {new Date(booking.checkOut).toLocaleDateString()}
              </p>
              <p className="text-sm text-green-600 font-medium mt-1">
                ₹{booking.totalAmount} — {booking.paymentStatus}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export default DashboardBookings;
