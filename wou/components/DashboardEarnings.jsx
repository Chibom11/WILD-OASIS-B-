import React, { useContext, useState } from 'react';
import HostContext from '../context/HostContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

function DashboardEarnings() {
  const { paidRooms } = useContext(HostContext);

  const [selectedRange, setSelectedRange] = useState('total'); // 'week' | 'month' | 'year' | 'total'

  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);

  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);

  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const getValidPaidAt = (booking) => booking.paidAt && new Date(booking.paidAt);

  const getFilteredRooms = (range) => {
    return paidRooms.filter((b) => {
      const paidAt = getValidPaidAt(b);
      if (!paidAt) return false;
      if (range === 'week') return paidAt >= oneWeekAgo;
      if (range === 'month') return paidAt >= oneMonthAgo;
      if (range === 'year') return paidAt >= oneYearAgo;
      return true;
    });
  };

  const totalEarnings = paidRooms.reduce((sum, b) => sum + b.totalAmount, 0);
  const weeklyEarnings = getFilteredRooms('week').reduce((sum, b) => sum + b.totalAmount, 0);
  const monthlyEarnings = getFilteredRooms('month').reduce((sum, b) => sum + b.totalAmount, 0);
  const yearlyEarnings = getFilteredRooms('year').reduce((sum, b) => sum + b.totalAmount, 0);

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const earningsByCabin = getFilteredRooms(selectedRange).reduce((acc, booking) => {
    const roomName = booking.room?.name || 'Unknown';
    acc[roomName] = (acc[roomName] || 0) + booking.totalAmount;
    return acc;
  }, {});

  const chartData = Object.entries(earningsByCabin).map(([name, total]) => ({
    name,
    total,
  }));

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-900 mb-2">📊 Earnings Dashboard</h2>
      <p className="italic text-sm text-gray-600 mb-6">
        Note: The earnings displayed here reflect only online transactions made through the website.
        We do not track in-person payments between guests and hosts.
      </p>


      {paidRooms.length === 0 ? (
        <div className="text-gray-500 text-center text-lg mt-20">
          No earnings yet from bookings.
        </div>
      ) : (
        <div className="space-y-10">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              label="Total Earnings"
              value={totalEarnings}
              active={selectedRange === 'total'}
              onClick={() => setSelectedRange('total')}
            />
            <SummaryCard
              label="Last 7 Days"
              value={weeklyEarnings}
              active={selectedRange === 'week'}
              onClick={() => setSelectedRange('week')}
            />
            <SummaryCard
              label="Last 30 Days"
              value={monthlyEarnings}
              active={selectedRange === 'month'}
              onClick={() => setSelectedRange('month')}
            />
            <SummaryCard
              label="Last 1 Year"
              value={yearlyEarnings}
              active={selectedRange === 'year'}
              onClick={() => setSelectedRange('year')}
            />
          </div>

          {/* Vertical Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Earnings by Cabin ({selectedRange === 'total' ? 'All Time' : `Last ${selectedRange === 'week' ? '7 Days' : selectedRange === 'month' ? '30 Days' : '1 Year'}`})
            </h4>
           <ResponsiveContainer width="100%" height={520} className="rounded-2xl mt-[30px]">
              <BarChart
                data={chartData}
                margin={{ top: 50, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  markerWidth={100}
                  textAnchor="middle"
                  interval={0}
                  height={80}
                />
                <YAxis tickFormatter={(val) => `₹${val}`} />
                <Tooltip formatter={(val) => `₹${val}`} />
                <Bar dataKey="total" fill="#34d399" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>
      )}
    </div>
  );
}

// Summary Card
function SummaryCard({ label, value, onClick, active }) {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow border-2 ${
        active ? 'border-green-500' : 'border-transparent'
      }`}
    >
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-green-600">{formatter.format(value)}</p>
    </div>
  );
}

export default DashboardEarnings;
