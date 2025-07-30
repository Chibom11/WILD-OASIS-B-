// pages/HostDashboard.jsx
import React from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, BedDouble, CalendarCheck2, BarChartBig, Settings } from 'lucide-react';
import { HostContextProvider } from '../context/HostContext';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { IoIosTime } from "react-icons/io";

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/host/dashboard' },
  { icon: BedDouble, label: 'My Rooms', path: '/host/rooms' },
  { icon: CalendarCheck2, label: 'Reservations', path: '/host/bookings' },
  { icon: CalendarCheck2, label: 'Past Bookings', path: '/host/pastbookings' },
  { icon: BarChartBig, label: 'Earnings', path: '/host/earnings' },
  { icon: Settings, label: 'Settings', path: '/host/settings' },
];

const HostDashboard = () => {
  const navigate = useNavigate();

  return (
    <HostContextProvider>
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}

        <aside className="w-64 bg-rose-500 text-white flex flex-col p-6 shadow-lg h-screen sticky top-0">
          <IoArrowBack onClick={()=>navigate('/profile')} className='w-[20px] h-[20px] mb-[30px]'/>
          <h2 className="text-2xl font-bold mb-8">Host Dashboard</h2>

          <nav className="flex flex-col space-y-4">
            {menuItems.map((item, index) => (
              <Link
                to={item.path}
                key={index}
                className="flex items-center gap-3 hover:bg-rose-600 rounded px-3 py-2 transition"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          
          <Outlet />
        </main>
      </div>
    </HostContextProvider>
  );
};

export default HostDashboard;
