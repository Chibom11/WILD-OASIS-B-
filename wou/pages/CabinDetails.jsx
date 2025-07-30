import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function CabinDetails({ id, image1, image2, image3, name, rentpd, guestCount, desc }) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  function getCabinInfo() {
    navigate(`/cabin/${id}`);
  }

  return (
    <div className="relative flex bg-white shadow-md rounded-xl overflow-hidden w-full max-w-md min-h-[220px] transform transition-transform duration-300 hover:scale-105 will-change-transform">
      <img
        src={image1}
        alt={`Image of ${name}`}
        loading="lazy"
        className="w-2/5 object-cover transition-transform duration-300 hover:scale-110 will-change-transform"
        onClick={getCabinInfo}
      />
      <div className="p-3 w-3/5 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800 line-clamp-1">{name}</h2>
          <p className="text-gray-600 mt-1 text-xs line-clamp-2">{desc}</p>
          <div className="mt-2 space-y-0.5 text-xs">
            <p><span className="font-semibold">Rent/day:</span> ₹{rentpd}</p>
            <p><span className="font-semibold">Guests:</span> {guestCount}</p>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button className="bg-black text-white px-3 py-1.5 text-sm rounded-lg hover:scale-[110%] transition duration-300">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default CabinDetails;
