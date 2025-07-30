import mongoose from 'mongoose';

const hostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // 1-to-1: one user = one host profile
  },
  businessName: {
    type: String,
    required: true,
  },
  gstNumber: {
    type: String, // optional but useful for Indian context
  },
  panNumber: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    upiId: String,
  },
    address: {
        type: String,
        required: true,
    },
    hostRating: {
        type: Number,
        default: 0,
    },

  hostBio: {
    type: String,
    default: '',
  },
 
  isVerified: {
    type: Boolean,
    default: false,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

export const Host = mongoose.model('Host', hostSchema);
