import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GiForkKnifeSpoon } from "react-icons/gi";
import { MdTableBar } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import {fetchWithAuthRetry} from '../utils/authutil.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import HostDetails from '../components/HostDetails.jsx';


const amenitiesIcons = {
  'Kitchen': <GiForkKnifeSpoon className="w-6 h-6 text-gray-700" />,
  'Dining Room': <MdTableBar className="w-6 h-6 text-gray-700"/>,
  'Parking Area': <FaCar className="w-6 h-6 text-gray-700"/>,
};

function AmenityItem({ label }) {
  const icon = amenitiesIcons[label] || (
    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );

  return (
    <div className="flex items-center space-x-4">
      {icon}
      <span className="text-gray-800 text-md">{label}</span>
    </div>
  );
}


function CabinInfo() {
  const { id } = useParams();
  const [cabin, setCabin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [errors, setErrors] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(1);
  const [hostInfo, setHostInfo] = useState(null);
  const navigate=useNavigate();
   const user = JSON.parse(localStorage.getItem("user"));
   

  useEffect(() => {
    async function fetchCabinById() {
      try {
        const data = await fetchWithAuthRetry('/users/rooms');
        const foundCabin = data.data.find(cabin => cabin._id === id);
        localStorage.setItem('room', JSON.stringify(foundCabin));
        
        if (foundCabin?.owner) {
          const res = await axios.post('http://localhost:8000/api/users/hostinfo',{
            ownerId: foundCabin.owner,
          }, {
            withCredentials: true,
          });
          setHostInfo(res.data);
          console.log(res.data)
        }
        setCabin(foundCabin);
        console.log(foundCabin)
      } catch (error) {
        console.error('Failed to fetch cabin:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCabinById();
  }, [id]);

  const handleCheckInChange = (e) => {
  const selectedDate = e.target.value;
  const selected = new Date(selectedDate);
  const today = new Date();

  // Strip time (set to midnight)
  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  let newErrors = { ...errors };

  if (selected < today) {
    newErrors.checkIn = 'Check-in must be at least today.';
  } else {
    newErrors.checkIn = '';
  }

  if (checkOutDate && new Date(checkOutDate) <= selected) {
    newErrors.checkOut = 'Check-out must be after check-in.';
  } else {
    newErrors.checkOut = '';
  }

  setCheckInDate(selectedDate);
  setErrors(newErrors);
};

const handleCheckOutChange = (e) => {
  const selectedDate = e.target.value;
  let newErrors = { ...errors };

  if (new Date(selectedDate) <= new Date(checkInDate)) {
    newErrors.checkOut = 'Check-out must be after check-in.';
  } else {
    newErrors.checkOut = '';
  }

  setCheckOutDate(selectedDate);
  setErrors(newErrors);
};

 
 const handleCheckAvailability = async () => {
  if (!checkInDate || !checkOutDate) {
    toast.error("Both Check-In and Check-Out dates are required");
    return;
  }

  if (errors.checkIn || errors.checkOut) {
    toast.error("Please correct the date errors before proceeding");
    return;
  }

  const checkAvailability = async () => {
    const res = await axios.post(
      'http://localhost:8000/api/users/isavailable',
      {
        roomId: id,
        newCheckIn: checkInDate,
        newCheckOut: checkOutDate,
      },
      { withCredentials: true }
    );

    const { message } = res.data;

    if (message === true) {
      localStorage.setItem(
        'booking',
        JSON.stringify({
          checkInDate: new Date(checkInDate).toISOString().split("T")[0],
          checkOutDate: new Date(checkOutDate).toISOString().split("T")[0],
          maxguests: guests,
        })
      );
      navigate(`/bookingdetails/${id}`); // ✅ fix the URL
    } else {
      toast.error("This room is not available for your stay duration");
    }
  };

  try {
    await checkAvailability();
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      try {
        // Refresh the token
        await axios.get('http://localhost:8000/api/auth/refresh-token', {
          withCredentials: true,
        });

        // Retry availability check once
        await checkAvailability();
      } catch (refreshError) {
        console.error("Error refreshing access token:", refreshError);
        toast.error("Session expired. Please log in again.");
      }
    } else {
      console.error("Availability check error:", error);
      toast.error(message || "Something went wrong. Please try again.");
    }
  }
};


  if (loading)  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-700">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
      <p className="text-xl font-medium">Loading Cabin </p>
    </div>
  );


  if (!cabin) return <div className="flex justify-center items-center h-screen bg-gray-50 text-xl text-red-600">Cabin not found. Please check the ID.</div>;

  const mainImage = cabin.cabin_img[0] || 'https://via.placeholder.com/1200x800?text=Main+Cabin+View';
  const smallImages = cabin.cabin_img.slice(1, 5);
  const remainingImagesCount = cabin.cabin_img.length - 5;

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">
      {/* --- Page Header --- */}
      <div className="max-w-6xl mx-auto pt-10 pb-4 px-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{cabin.name}</h1>
        <div className="flex items-center text-gray-600 text-lg">
          <span className="text-yellow-500 mr-1 text-xl">&#9733;</span>
          <span className="font-semibold mr-2">4.83</span>
          <span className="text-gray-500">· 236 reviews</span>
          <span className="mx-2 text-gray-400">·</span>
          <span>{cabin.address}, {cabin.city}</span>
          <span className="mx-2 text-gray-400">·</span>
          <span>{cabin.maxGuests} guests · {cabin.maxGuests || 1} bedroom · {cabin.maxGuests || 1} bed · {Math.ceil(cabin.maxGuests/2) || 1} bathrooms</span>
        </div>
      </div>

      {/* --- Main Content Area: Image Gallery & Booking Card --- */}
      <div className="max-w-6xl mx-auto mt-6 px-6 grid grid-cols-3 gap-8"> {/* Main grid for content */}

        {/* Left Column: Image Gallery (Span 2 columns) */}
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4 rounded-2xl overflow-hidden shadow-xl">
            {/* Main large image on the left */}
            <div className="relative col-span-1 row-span-2">
              <img
                src={mainImage}
                alt="Main cabin view"
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>

            {/* Smaller images on the right, arranged in a 2x2 grid */}
            <div className="grid grid-cols-2 gap-4 col-span-1">
              {smallImages.map((img, idx) => (
                <div key={idx} className="relative w-full h-[250px] overflow-hidden">
                  <img
                    src={img}
                    alt={`Cabin preview ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                  />
                  {/* "Show all photos" button for the last small image */}
                  {idx === 3 && ( // Assumes 4 small images
                    <button className="absolute bottom-4 right-4 px-5 py-2 bg-white text-gray-900 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      
                    </button>
                  )}
                </div>
              ))}
              {/* Placeholders for remaining empty grid cells on the right */}
              {smallImages.length < 4 && Array(4 - smallImages.length).fill().map((_, idx) => (
                <div key={`placeholder-${idx}`} className="relative w-full h-[250px] bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg">
                  No Image Available
                  {idx === (3 - smallImages.length) && (
                    <button className="absolute bottom-4 right-4 px-5 py-2 bg-white text-gray-900 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: "Add dates for prices" Card */}
        <div className="col-span-1 flex flex-col items-center"> {/* Occupies the third column */}
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Add dates for prices</h2>

         <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="border border-gray-300 rounded-lg p-3">
            <label htmlFor="check-in" className="block text-xs font-semibold text-gray-700 uppercase mb-1">CHECK-IN</label>
            <input
              type="date"
              id="check-in"
              className="w-full text-sm focus:outline-none focus:ring-0 bg-transparent"
              value={checkInDate}
              onChange={handleCheckInChange}
            />
            {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>}
          </div>

          <div className="border border-gray-300 rounded-lg p-3">
            <label htmlFor="check-out" className="block text-xs font-semibold text-gray-700 uppercase mb-1">CHECKOUT</label>
            <input
              type="date"
              id="check-out"
              className="w-full text-sm focus:outline-none focus:ring-0 bg-transparent"
              value={checkOutDate}
              onChange={handleCheckOutChange}
            />
            {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
          </div>
        </div>


            <div className="border border-gray-300 rounded-lg p-3 mb-6 relative">
              <label htmlFor="guests" className="block text-xs font-semibold text-gray-700 uppercase mb-1">GUESTS</label>
              <select
                id="guests"
                className="w-full text-sm appearance-none bg-transparent focus:outline-none focus:ring-0 cursor-pointer pr-8"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
              >
                {Array.from({ length: cabin.maxGuests || 5 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
              {/* Custom arrow for select input */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <button
              onClick={handleCheckAvailability}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-4 rounded-lg shadow-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105"
            >
              Check availability
            </button>
          </div>
          <a href="#" className="flex items-center mt-6 text-gray-600 hover:text-gray-900 transition-colors duration-200">
            
           
          </a>
        </div>
      </div> {/* End of Main Content Area Grid */}

      {/* --- Cabin Details Section (Below Images & Card) --- */}
               {hostInfo?.data?.user?.avatar && (
                <HostDetails avatar={hostInfo.data.user.avatar} bio={hostInfo.data.hostBio} name={(hostInfo.data.user.fullname.charAt(0)).toUpperCase()+hostInfo.data.user.fullname.slice(1)}/>
)}
      <div className="max-w-6xl mx-auto py-16 px-6">
        {/* Basic Info */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">About this place</h2>
        <p className="text-gray-700 text-lg mb-10 leading-relaxed border-l-4 border-gray-300 pl-6 rounded-md bg-gray-50 py-4 px-2 shadow-sm">
          {cabin.description}
        </p>

     <div className="mb-16 border-t pt-10 border-gray-200">
  <h2 className="text-3xl font-extrabold text-gray-900 mb-8">What this place offers</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
    <AmenityItem label="Kitchen" />
    <AmenityItem label="Dining Room" />
    <AmenityItem label="Parking Area" />
    {cabin.amenities?.[0] && <AmenityItem label={cabin.amenities[0]} />}
    {cabin.amenities?.[1] && <AmenityItem label={cabin.amenities[1]} />}
    {cabin.amenities?.[2] && <AmenityItem label={cabin.amenities[2]} />}
    {cabin.amenities?.[3] && <AmenityItem label={cabin.amenities[3]} />}
  </div>
</div>

        {/* Highlights - Modernized Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6 text-lg bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cabin Highlights</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <p><strong className="text-gray-800">City:</strong> {cabin.city}</p>
                <p><strong className="text-gray-800">Locality:</strong> {cabin.address}</p>
                <p><strong className="text-gray-800">Type:</strong> {cabin.type}</p>
                <p><strong className="text-gray-800">Max Guests:</strong> {cabin.maxGuests}</p>
                <p><strong className="text-gray-800">Rent Per Night:</strong> <span className="font-bold text-green-600">₹{cabin.pricePerNight}</span></p>
                
            </div>
          </div>

          {/* Bathroom Preview */}
          <div className="rounded-lg overflow-hidden shadow-md group">
            <h3 className="sr-only">Bathroom View</h3>
            <img
              src={cabin.bathroom_img || 'https://via.placeholder.com/600x400?text=Bathroom+View'}
              alt="Bathroom"
              className="w-full h-[300px] object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          </div>
        </div>

        {/* Balcony Image Row - Enhanced */}
        <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Explore the Balcony Views</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-x-auto pb-4 mb-20">
          {cabin.balcony_img.map((img, idx) => (
            <div key={idx} className="h-64 rounded-lg overflow-hidden shadow-lg group">
              <img
                src={img}
                alt={`Balcony ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
            </div>
          ))}
        </div>
         


        



        {/* Footer */}
        <div className="text-center text-sm text-gray-400 mt-10 border-t pt-8 border-gray-200">
          Listing ID: {cabin._id}
        </div>
      </div>
      <div className="absolute top-4 right-4 z-50" onClick={()=>navigate('/profile')}>
      {user ? (
        <img
        src={user.avatar}
        alt="User Avatar"
        className="w-10 h-10 rounded-full border border-gray-300 shadow-md object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold border border-gray-300 shadow-md">
          ?
        </div>
      )}
    </div>
   
    </div>
  );
}

export default CabinInfo;