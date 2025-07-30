import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import HostContext from '../context/HostContext'; 

function DashboardRooms() {
  const navigate = useNavigate();
  const { hostRooms } = useContext(HostContext); 

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-rose-600">Your Listed Rooms</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostRooms.map((room) => (
          <div
            key={room._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition hover:shadow-xl"
          >
            <img
              src={room.cabin_img[0]}
              alt={room.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{room.name}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {room.city} — ₹{room.pricePerNight}/night
              </p>
              <p className="text-gray-600 text-sm mb-2">
                {room.address.slice(0, 60)}...
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {room.amenities.slice(0, 3).map((amenity, i) => (
                  <span
                    key={i}
                    className="bg-rose-100 text-rose-600 text-xs font-medium px-2 py-1 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  className="text-sm text-rose-600 hover:underline font-medium"
                  onClick={() => navigate(`/cabin/${room._id}`)}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hostRooms.length === 0 && (
        <div className="text-center text-gray-600 mt-10">
          You haven't added any rooms yet.
        </div>
      )}
    </div>
  );
}

export default DashboardRooms;
