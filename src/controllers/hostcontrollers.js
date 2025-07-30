import {Host} from "../models/host.js";
import {User} from "../models/user.js";
import { Rooms } from '../models/rooms.js';
import { Booking } from '../models/bookings.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
export const createHostProfile=async(req,res)=>{
    const userId = req.user._id; // from auth middleware
    const {gstNumber,panNumber,contactNumber,businessName,bankDetails,address,hostBio} = req.body;
    if(!userId || !businessName || !address || !bankDetails || !gstNumber || !panNumber || !contactNumber){
        return res.status(400).json({success:false,message:"All fields are required"});
    }
    try {
        const existingHost = await Host.findOne({ user: userId });
        if (existingHost) {
        return res.status(400).json({
            success: false,
            message: "Host profile already exists for this user.",
        });
        }

        // Additional uniqueness checks across other hosts
        const duplicateFields = [];

        const gstExists = await Host.findOne({ gstNumber });
        if (gstExists) duplicateFields.push("GST Number");

        const panExists = await Host.findOne({ panNumber });
        if (panExists) duplicateFields.push("PAN Number");

        const contactExists = await Host.findOne({ contactNumber });
        if (contactExists) duplicateFields.push("Contact Number");

        const businessExists = await Host.findOne({ businessName });
        if (businessExists) duplicateFields.push("Business Name");

        if (duplicateFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `${duplicateFields.join(", ")} already registered with another host.`,
        });
        }

        const newhost=await Host.create({
            user:userId,
            businessName:businessName,
            gstNumber:gstNumber,
            panNumber:panNumber,
            contactNumber:contactNumber,
            bankDetails:bankDetails,
            address:address,
            hostBio:hostBio
        })

        const updatedUser=await User.findByIdAndUpdate(userId,{
            role:"host",
        },{
            new:true,
            

        })
        if(!updatedUser){
            return res.status(404).json({success:false,message:"User not found"});
        }
        return res.status(201).json({
            success:true,
            message:"Host profile created successfully",
            data:newhost
        });

        
    } catch (error) {
        console.error("Error creating host profile:", error);
        return res.status(500).json({ success: false, message: "Server error. Could not create host profile." });
        
    }
}




export const createRoom = async (req, res) => {
  try {
    const {
      name,
      description,
      city,
      address,
      pricePerNight,
      maxGuests,
      amenities,
    } = req.body;

    const cabin_img = [];
    const bathroom_img = [];
    const balcony_img = [];

    // Cloudinary Uploads
    const uploadImages = async (files, targetArray) => {
      for (const file of files || []) {
        const result = await uploadOnCloudinary(file.path);
        targetArray.push(result.secure_url);
      }
    };

    await uploadImages(req.files['cabin_img'], cabin_img);
    await uploadImages(req.files['bathroom_img'], bathroom_img);
    await uploadImages(req.files['balcony_img'], balcony_img);

    // Normalize amenities input
    let parsedAmenities = [];
    if (Array.isArray(amenities)) {
      parsedAmenities = amenities;
    } else if (typeof amenities === 'string') {
      parsedAmenities = amenities.split(',').map((a) => a.trim());
    }

    const room = await Rooms.create({
      owner: req.user._id,
      name,
      description,
      city,
      address,
      cabin_img,
      bathroom_img,
      balcony_img,
      pricePerNight,
      maxGuests,
      amenities: parsedAmenities,
    });

    return res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room,
    });
  } catch (error) {
    console.error('Room creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating room',
    });
  }
};


export const getHostRooms=async (req,res)=>{
  const userId=req.user._id; // from auth middleware

  if(!userId){
    return res.status(400).json({success:false,message:"User ID is required"});
  }
  try {
    const rooms = await Rooms.find({ owner: userId }).populate('owner');
    
    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ success: false, message: "No rooms found for this host." });
    }

    return res.status(200).json({
      success: true,
      message: "Rooms retrieved successfully",
      data: rooms,
    });
  } catch (error) {
    console.error("Error retrieving host rooms:", error);
    return res.status(500).json({ success: false, message: "Server error while retrieving rooms." });
  }

}

// Backend controller
export const getPaidConfirmedBookings = async (req, res) => {
  const { roomIds } = req.body;

  if (!roomIds || !Array.isArray(roomIds)) {
    return res.status(400).json({ success: false, message: "roomIds must be an array" });
  }

  try {
    const paidrooms = await Booking.find({
      room: { $in: roomIds },
      paymentStatus: 'completed',
      bookingStatus: 'confirmed',
    }).populate('user').populate('room'); // Optional if you want full details

    res.status(200).json({
      success: true,
      message: "Filtered bookings fetched successfully",
      data: paidrooms
    });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getUnConfirmedBookings = async (req, res) => {
  const { roomIds } = req.body;

  if (!roomIds || !Array.isArray(roomIds)) {
    return res.status(400).json({ success: false, message: "roomIds must be an array" });
  }

  try {
    const paidrooms = await Booking.find({
      room: { $in: roomIds },
      paymentStatus: 'pending',
      bookingStatus: 'confirmed',
    }).populate('user').populate('room'); 

    res.status(200).json({
      success: true,
      message: "Filtered bookings fetched successfully",
      data: paidrooms
    });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const setCheckedIn=async(req,res)=>{
  const { bookingId } = req.body;

  if(!bookingId){
    return res.status(400).json({success:false,message:"Booking id is required"});

  }
  try {
    const booking=await Booking.findByIdAndUpdate(bookingId, {
      checkedInUser:true,
    })
    if(!booking){
      return res.status(404).json({success:false,message:"Booking not found"});
    }
    return res.status(200).json({success:true,message:"User checked in successfully",data:booking});
    
  } catch (error) {
    console.error("Error checking in user:", error);
    return res.status(500).json({ success: false, message: "Server error while checking in user." });

    
  }

}

export const setCheckedOut=async(req,res)=>{
  const { bookingId } = req.body;

  if(!bookingId){
    return res.status(400).json({success:false,message:"Booking id is required"});

  }
  try {
    const booking=await Booking.findByIdAndUpdate(bookingId, {
      checkedOutUser:true,
    })
    if(!booking){
      return res.status(404).json({success:false,message:"Booking not found"});
    }
    return res.status(200).json({success:true,message:"User checked in successfully",data:booking});
    
  } catch (error) {
    console.error("Error checking in user:", error);
    return res.status(500).json({ success: false, message: "Server error while checking in user." });

    
  }

}

export const markbookingAsPaid=async (req,res)=>{
  const {bookingId}=req.body;
  if(!bookingId){
    return res.status(400).json({success:false,message:"Booking Id is required"});

  }

  try {
    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: 'completed',
      
    })
    return res.status(200).json({success:true,message:"Booking marked as paid successfully"});
    
  } catch (error) {
    
    return res.status(500).json({ success: false, message: "Server error while marking booking as paid." });
    
  }


}

export const getHostProfile=async (req,res)=>{
  const {ownerId} = req.body;
  if(!ownerId){
    return res.status(400).json({success:false,message:"Owner ID is required"});
  }

  const hostProfile= await Host.findOne({user:ownerId}).populate('user');
  if(!hostProfile){
    return res.status(404).json({success:false,message:"Host profile not found"});
  }
  return res.status(200).json({
    success:true,
    message:"Host profile retrieved successfully",
    data:hostProfile
  });
}