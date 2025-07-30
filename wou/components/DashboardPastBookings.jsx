import React, { useContext, useEffect, useState } from 'react';
import HostContext from '../context/HostContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function DashboardPastBookings() {
  const { paidRooms, unpaidRooms } = useContext(HostContext);
  const [allRooms, setAllRooms] = useState([]);
  const today = new Date();

  // Combine paid and unpaid rooms into state when they change
  useEffect(() => {
    setAllRooms([...paidRooms, ...unpaidRooms]);
  }, [paidRooms, unpaidRooms]);

  const handleMarkAsPaid = async (bookingId) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/users/paid',
        { bookingId },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success('Marked as paid!');
        setAllRooms(prev =>
          prev.map(b =>
            b._id === bookingId ? { ...b, paymentStatus: 'completed' } : b
          )
        );
      } else {
        toast.error('Failed to mark as paid');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error marking as paid');
    }
  };

  const completedStays = allRooms.filter(
    (b) =>
      b.checkedInUser === true &&
      b.checkedOutUser === true &&
      new Date(b.checkOut) < today
  );

  const currentlyStaying = allRooms.filter(
    (b) =>
      b.checkedInUser === true &&
      b.checkedOutUser === false 
  );

  const noShowBookings = allRooms.filter(
    (b) =>
      b.checkedInUser === false &&
      b.checkedOutUser === false &&
      new Date(b.checkOut) < today
  );

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const renderBookings = (bookings, label, showMarkAsPaid = false) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{label}</h3>
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-sm">No bookings in this category.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {bookings.map((b) => {
            const isPending = b.paymentStatus !== 'completed';

            return (
              <li
                key={b._id}
                className="py-3 flex justify-between items-start text-sm"
              >
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">{b.user?.username}</span> booked{' '}
                    <span className="font-medium text-blue-600">{b.room?.name}</span>
                  </p>
                  <p className="text-gray-500">
                    {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                  </p>
                  <p className="mt-1">
                    {isPending ? (
                      <span className="text-yellow-500 font-medium">⏳ Pending</span>
                    ) : (
                      <span className="text-green-600 font-medium">✅ Paid</span>
                    )}
                  </p>

                  {showMarkAsPaid && isPending && (
                    <button
                      onClick={() => handleMarkAsPaid(b._id)}
                      className="mt-2 bg-rose-600 text-white px-3 py-1 rounded-md text-xs hover:bg-rose-700"
                    >
                      💰 Mark as Paid
                    </button>
                  )}
                </div>
                <div className="text-green-600 font-semibold mt-1">
                  ₹{b.totalAmount.toLocaleString('en-IN')}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-8 max-w-screen-lg mx-auto space-y-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">🛏️ Past Bookings Overview</h2>
      {renderBookings(completedStays, '✅ Completed Stays')}
      {renderBookings(currentlyStaying, '🟡 Overdue Checkouts', true)}
      {renderBookings(noShowBookings, '❌ No Show (Never Checked In)')}
    </div>
  );
}

export default DashboardPastBookings;
