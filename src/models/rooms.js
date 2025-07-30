import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Every room must belong to a host user
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  cabin_img: {
    type: [String], // Array of image URLs
    required: true,
  },
  bathroom_img: {
    type: [String], // Single image URL
    required: true,
  },
  balcony_img: {
    type: [String], // Array of image URLs
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  maxGuests: {
    type: Number,
    required: true,
  },
  bookingDetails:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Bookings', // Reference to the Bookings model
  },
  amenities: {
    type: [String], // e.g. ["WiFi", "Pool"]
    required: true,
  },
  ratings: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});
export const Rooms = mongoose.model('Rooms', roomSchema);
