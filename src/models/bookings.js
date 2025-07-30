import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rooms',
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'paypal', 'cash'],
    default: 'upi',
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'unconfirmed'],
    default: 'unconfirmed',
  },
  cancellationDate: {
    type: Date,
  },
  cancellationReason: {
    type: String,
  },
  isReviewed: {
    type: Boolean,
    default: false,
  },
  specialRequests: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
   paidAt: {
    type: Date, // ✅ Add this field
    default: null,
  },
  checkedInUser: { type: Boolean, default: false },
  checkedOutUser: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const Booking = mongoose.model('Booking', bookingSchema);
