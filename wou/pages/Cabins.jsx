import React, { useState, useEffect } from 'react';
import CabinDetails from './CabinDetails.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { fetchWithAuthRetry } from '../utils/authutil.js';
import { useNavigate } from 'react-router-dom';

const ROOMS_PER_PAGE = 15;

function Cabins() {
  const [cabindata, setCabinData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    async function getCabinData() {
      try {
        const data = await fetchWithAuthRetry('/users/rooms');
        console.log(data.data);
        setCabinData(data.data);
      } catch (err) {
        console.error('Error fetching cabins:', err);
      }
    }

    getCabinData();
  }, []);

  useEffect(() => {
    setCurrentPage(0); 
  }, [searchQuery]);

  
  const filteredCabins = cabindata.filter((cabin) =>
    cabin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cabin.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cabin.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalcabins = filteredCabins.length;
  const startIndex = currentPage * ROOMS_PER_PAGE;
  const endIndex = startIndex + ROOMS_PER_PAGE;
  const visibleCabins = filteredCabins.slice(startIndex, endIndex);

  const rawuser = JSON.parse(localStorage.getItem("user"));
  const user = rawuser?.user;

  return (
    <>
      <header className="relative bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 py-24 px-10 shadow-2xl overflow-hidden h-[60%]">
        <div className="absolute inset-0 bg-pattern-dots opacity-20 z-0"></div>
        <div className="absolute inset-0 bg-radial-gradient opacity-10 z-0"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-md">
            Find Your Perfect Getaway
          </h1>
          <p className="text-xl md:text-2xl text-white mt-4 opacity-90 drop-shadow-sm">
            Discover unique cabins, apartments & more around the world.
          </p>
        </div>

        <div
          className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm text-gray-800 px-5 py-3 rounded-full shadow-xl flex items-center space-x-3 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer z-20"
          onClick={() => navigate('/profile')}
        >
          <img
            src={user?.avatar || "https://placehold.co/50x50/cccccc/ffffff?text=U"}
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-pink-500 shadow-inner object-cover"
          />
          <div className="leading-tight">
            <p className="text-sm font-medium text-gray-600">Welcome back,</p>
            <p className="text-lg font-bold text-gray-900">{user?.username || 'Guest'}</p>
          </div>
        </div>

        <div className="relative z-10 flex justify-center mt-16">
          <div className="w-full max-w-3xl">
            <SearchBar setSearchQuery={setSearchQuery} />
          </div>
        </div>

        <style>{`
          .bg-pattern-dots {
            background-image: radial-gradient(circle, #fff 1px, transparent 1px);
            background-size: 8px 8px;
          }
          .bg-radial-gradient {
            background: radial-gradient(circle at top left, rgba(255,255,255,0.1) 0%, transparent 50%);
          }
        `}</style>
      </header>

      <h2 className="text-4xl font-bold text-gray-800 text-center mt-12 mb-8">
        Explore our Cabins
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4 mt-8">
        {visibleCabins.map((cabin) => (
          <CabinDetails
            key={cabin._id}
            id={cabin._id}
            image1={cabin.cabin_img[0]}
            image2={cabin.cabin_img[1]}
            image3={cabin.cabin_img[2]}
            name={cabin.name}
            guestCount={cabin.maxGuests}
            rentpd={cabin.pricePerNight}
            desc={cabin.description}
          />
        ))}
      </div>

      <footer className="flex justify-between items-center px-6 py-4 mt-6 border-t">
        <div className="text-gray-600">
          Page {currentPage + 1} of {Math.ceil(totalcabins / ROOMS_PER_PAGE)}
        </div>
        <div className="flex space-x-4">
          {startIndex > 0 && (
            <button
              onClick={() => setCurrentPage((curr) => curr - 1)}
              className="bg-black text-white px-4 py-2 rounded hover:scale-[110%] transition"
            >
              Prev
            </button>
          )}
          {endIndex < totalcabins ? (
            <button
              onClick={() => setCurrentPage((curr) => curr + 1)}
              className="bg-black text-white px-4 py-2 rounded hover:scale-[110%] transition"
            >
              Next
            </button>
          ) : (
            <button className="invisible bg-black text-white px-4 py-2 rounded">
              Next
            </button>
          )}
        </div>
      </footer>
    </>
  );
}

export default Cabins;
