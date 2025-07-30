import React, { useContext, useEffect, useState } from 'react';
import HostContext from '../context/HostContext';

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function DashboardLanding() {
  const {
    hostRooms,
    paidRooms,
    unpaidRooms,
  } = useContext(HostContext);

  const [todaysCheckIns, setTodaysCheckIns] = useState([]);
  const [todaysCheckOuts, setTodaysCheckOuts] = useState([]);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const totalRooms = hostRooms.length;

  const upcomingBookings = [...paidRooms, ...unpaidRooms].filter((booking) => {
    const checkInDate = new Date(booking.checkIn);
    return checkInDate > new Date();
  }).length;

  const totalEarnings = paidRooms.reduce((sum, b) => sum + b.totalAmount, 0);

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  });

  const now = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      total: paidRooms
        .filter(b => new Date(b.paidAt).toDateString() === date.toDateString())
        .reduce((sum, b) => sum + b.totalAmount, 0),
    };
  });

  const isToday = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    const allBookings = [...paidRooms, ...unpaidRooms];
    setTodaysCheckIns(allBookings.filter(b => isToday(b.checkIn)));
    setTodaysCheckOuts(allBookings.filter(b => isToday(b.checkOut)));
  }, [paidRooms, unpaidRooms]);

  const handleCheckIn = async (bookingId) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/users/checkinuser',
        { bookingId },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("User checked in successfully!");
        setTodaysCheckIns(prev =>
          prev.map(b => b._id === bookingId ? { ...b, checkedInUser: true } : b)
        );
      } else toast.error("Check-in failed.");
    } catch (err) {
      toast.error("Error checking in user");
      console.error(err);
    }
  };

  const handleCheckOut = async (bookingId) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/users/checkoutuser',
        { bookingId },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("User checked out successfully!");
        setTodaysCheckOuts(prev =>
          prev.map(b => b._id === bookingId ? { ...b, checkedOutUser: true } : b)
        );
      } else toast.error("Check-out failed.");
    } catch (err) {
      toast.error("Error checking out user");
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back 👋</h1>
        <p className="text-gray-500 text-sm">{currentDate}</p>
      </div>

      {/* Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard label="Total Rooms" value={totalRooms} color="indigo" icon="🏠" />
        <MetricCard label="Upcoming Bookings" value={upcomingBookings} color="green" icon="📅" />
        <MetricCard label="Total Earnings" value={formatter.format(totalEarnings)} color="yellow" icon="💸" />
      </section>

      {/* Earnings Chart */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">📈 Analytics Overview</h2>
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Last 30 Days Earnings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last30Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(val) => `₹${val}`} />
              <Tooltip formatter={(val) => `₹${val}`} />
              <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Today's Check-ins */}
      {todaysCheckIns.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">🛎️ Today’s Check-ins</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {todaysCheckIns.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                buttonLabel="✅ Check-in User"
                onAction={handleCheckIn}
                checkedIn={booking.checkedInUser}
              />
            ))}
          </div>
        </section>
      )}

      {/* Today's Check-outs */}
      {todaysCheckOuts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">🚪 Today’s Check-outs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {todaysCheckOuts.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                buttonLabel="🚪 Check-out User"
                onAction={handleCheckOut}
                checkedOut={booking.checkedOutUser}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MetricCard({ label, value, color, icon }) {
  const colorMap = {
    indigo: 'text-indigo-600',
    green: 'text-green-600',
    yellow: 'text-yellow-500',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition duration-300 ease-in-out">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">{label}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}

function BookingCard({ booking, buttonLabel, onAction, checkedIn = false, checkedOut = false }) {
  const checkoutDate = new Date(booking.checkOut).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {booking.room?.name || "Unknown Room"}
      </h3>
      <p className="text-sm text-gray-600 mb-1">
        👤 <span className="font-medium">{booking.user?.fullname || "Guest"}</span>
      </p>
      <p className="text-sm text-gray-600 mb-3">
        💳 Payment:{" "}
        <span className={`font-medium ${booking.paymentStatus === "completed" ? "text-green-600" : "text-red-500"}`}>
          {booking.paymentStatus || "pending"}
        </span>
      </p>

      {checkedIn ? (
        <p className="text-sm text-gray-600 mt-2">
          ✅ Checked-in. Check-out on: <span className="font-medium text-indigo-600">{checkoutDate}</span>
        </p>
      ) : checkedOut ? (
        <p className="text-sm text-gray-600 mt-2">
          ✅ Checked-out on: <span className="font-medium text-indigo-600">{checkoutDate}</span>
        </p>
      ) : (
        <button
          onClick={() => onAction(booking._id)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

export default DashboardLanding;
