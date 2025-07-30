import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const AMENITY_OPTIONS = [
  "WiFi",
  "AC",
  "Parking",
  "TV",
  "Pets allowed",
  "Lift",
  "Smoke alarm",
  "Smoking allowed",
  "Washing Machine",
  "Iron",
  "Cot"
];

function AddRoom() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    address: '',
    pricePerNight: '',
    maxGuests: '',
    amenities: [],
  });
  const [loading, setLoading] = useState(false);

  const [cabinImages, setCabinImages] = useState([]);
  const [balconyImages, setBalconyImages] = useState([]);
  const [bathroomImages, setBathroomImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (e, currentImages, setImageState) => {
    const newFiles = Array.from(e.target.files);
    const totalFiles = currentImages.length + newFiles.length;

    if (totalFiles > 5) {
      toast.error('You can upload a maximum of 5 images.');
      return;
    }

    const filteredNewFiles = newFiles.filter(
      (newFile) => !currentImages.some((existing) => existing.name === newFile.name)
    );

    setImageState([...currentImages, ...filteredNewFiles]);
    e.target.value = '';
  };

  const handleRemoveImage = (index, setImageState, imageArray) => {
    const updated = [...imageArray];
    updated.splice(index, 1);
    setImageState(updated);
  };

  const renderImagePreviews = (images, setImageState) =>
    images.map((file, index) => (
      <div key={index} className="relative w-24 h-24 overflow-hidden rounded-lg shadow-md border border-gray-300">
        <img
          src={URL.createObjectURL(file)}
          alt={`preview-${index}`}
          className="object-cover w-full h-full"
        />
        <button
          type="button"
          onClick={() => handleRemoveImage(index, setImageState, images)}
          className="absolute top-0 right-0 text-white bg-black bg-opacity-60 px-1 rounded-bl text-xs"
        >
          ✕
        </button>
      </div>
    ));

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true); // Start loading

  const form = new FormData();
  form.append('name', formData.name);
  form.append('description', formData.description);
  form.append('city', formData.city);
  form.append('address', formData.address);
  form.append('pricePerNight', formData.pricePerNight);
  form.append('maxGuests', formData.maxGuests);
  formData.amenities.forEach((a) => form.append('amenities', a));
  cabinImages.forEach((file) => form.append('cabin_img', file));
  bathroomImages.forEach((file) => form.append('bathroom_img', file));
  balconyImages.forEach((file) => form.append('balcony_img', file));

  const submitForm = async () => {
    return await axios.post('http://localhost:8000/api/users/addroom', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });
  };

  try {
    const res = await submitForm();
    if (res.data.success) {
      toast.success('Room added successfully!');
      navigate('/host/dashboard');
    }
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        await axios.get('http://localhost:8000/api/auth/refresh-token', {
          withCredentials: true,
        });
        const retryRes = await submitForm();
        if (retryRes.data.success) {
          toast.success('Room added successfully after retry!');
          navigate('/profile');
        }
      } catch (retryErr) {
        console.error("Retry failed:", retryErr);
        toast.error("Failed to add room after retry.");
      }
    } else {
      console.error("Room add error:", error);
      toast.error("Failed to add room.");
    }
  } finally {
    setLoading(false); // Stop loading in any case
  }
};


  const FileInputButton = ({ id, label, onChange }) => (
    <div className="mb-2">
      <label htmlFor={id} className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
        {label} <span className="ml-1">➕</span>
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        className="hidden"
      />
    </div>
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat py-10"
      style={{ backgroundImage: "url('/imgs/cabin6.webp')" }}
    >
      <div className="relative z-10 max-w-6xl mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Add New Room</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
          {/* Left Side */}
          <div className="w-full md:w-1/2 space-y-4">
            <input name="name" onChange={handleChange} placeholder="Room Name" className="w-full border p-2 rounded" required />
            <textarea name="description" onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded h-24" required />
            <input name="city" onChange={handleChange} placeholder="City" className="w-full border p-2 rounded" required />
            <input name="address" onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded" required />
            <input name="pricePerNight" type="number" onChange={handleChange} placeholder="Price Per Night" className="w-full border p-2 rounded" required />
            <input name="maxGuests" type="number" onChange={handleChange} placeholder="Max Guests" className="w-full border p-2 rounded" required />

            <div>
              <label className="block font-semibold mb-1">Amenities:</label>
              <div className="grid grid-cols-2 gap-2">
                {AMENITY_OPTIONS.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <p className="mb-2 font-medium">Room Images (max 5)</p>
              <FileInputButton
                id="cabinInput"
                label="Room Images"
                onChange={(e) => handleImageChange(e, cabinImages, setCabinImages)}
              />
              <div className="mt-2 flex gap-2 flex-wrap">
                {renderImagePreviews(cabinImages, setCabinImages)}
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium">Bathroom Images (max 5)</p>
              <FileInputButton
                id="bathroomInput"
                label="Bathroom Images"
                onChange={(e) => handleImageChange(e, bathroomImages, setBathroomImages)}
              />
              <div className="mt-2 flex gap-2 flex-wrap">
                {renderImagePreviews(bathroomImages, setBathroomImages)}
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium">Balcony Images (max 5)</p>
              <FileInputButton
                id="balconyInput"
                label="Balcony Images"
                onChange={(e) => handleImageChange(e, balconyImages, setBalconyImages)}
              />
              <div className="mt-2 flex gap-2 flex-wrap">
                {renderImagePreviews(balconyImages, setBalconyImages)}
              </div>
            </div>
          </div>
        </form>
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              className="bg-rose-500 text-white px-6 py-2 rounded shadow hover:bg-rose-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Submit Room"}
            </button>
          </div>


      </div>
    </div>
  );
}

export default AddRoom;
