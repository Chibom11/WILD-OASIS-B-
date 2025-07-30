// src/controllers/bookingcontroller.js
import { Booking } from "../models/bookings.js";

export const getRoomBookingDetails = async (req, res) => {
  try {
    const bookings = await Booking.find();
    return res.status(200).json({
      success: true,
      message: "Booking Details for all rooms fetched",
      data: bookings,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Can't fetch bookings data" });
  }
};

export const isRoomAvailable = async (req, res) => {
  try {
    const { roomId, newCheckIn, newCheckOut } = req.body;

    if (!newCheckIn || !newCheckOut) {
      return res
        .status(400)
        .json({ message: "Both Check-In and Check-Out dates are required" });
    }

    const overlappingBookings = await Booking.findOne({
      room: roomId,
      checkIn: { $lt: newCheckOut },
      checkOut: { $gt: newCheckIn },
      bookingStatus: "confirmed",
    });

    const isAvailable = !overlappingBookings;
    return res
      .status(200)
      .json({ success: true, message: isAvailable });
  } catch (error) {
   
    return res
      .status(404)
      .json({ success: false, message: error.message });
  }
};


export const registerNewBooking=async(req,res)=>{
try {
      const {roomId,userId,checkIn,checkOut,guests,totalAmount,bookingStatus}=req.body;
  
      if(!roomId || !userId || !checkIn || !checkOut || !guests || !totalAmount || !bookingStatus){
        return res.status(400).json({success:false,message:"all  details are required"})
  
      }
      const bookingcheck=await Booking.findOne({
        
        user:userId,
        room:roomId,
        checkIn:checkIn,
        checkOut:checkOut,
  
      })
  
      if(bookingcheck){
        return res.status(405).json({success:false,message:"This exactly same booking already exists in database"})
      }
  
     const newBooking = new Booking({
      
      user: userId,
      room: roomId,
      checkIn,
      checkOut,
      numberOfGuests:guests,
      totalAmount,
      bookingStatus,
  });
  
    await newBooking.save();
    return res.status(200).json({success:true,message:"Booking Created Successfully"})
} catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ success: false, message: "Server error. Could not register booking." });
  
}
}

export const currenttrips=async(req,res)=>{
  const userId=req.user._id
  if(!userId){
    return res.status(400).json({success:false,message:"UserId is required"})
  }
  const bookings = await Booking.find({
  user: userId,
  bookingStatus: "confirmed",
  paymentStatus: "pending",
}).populate('room').sort({checkIn:1});
if(bookings.length===0){
  return res.status(404).json({success:false,message:"Bookings for this user not found"})
}
return res.status(200).json({success:true,message:"Bookings found",data:bookings})


}

export const pasttrips=async(req,res)=>{
  const userId=req.user._id
  if(!userId){
    return res.status(400).json({success:false,message:"UserId is required"})
  }
  const bookings = await Booking.find({
  user: userId,
  bookingStatus: "confirmed",
  paymentStatus: 'completed',
}).populate('room').sort({checkIn:1});
if(bookings.length===0){
  return res.status(404).json({success:false,message:"Bookings for this user not found"})
}
return res.status(200).json({success:true,message:"Bookings found",data:bookings})


}

export const cancelBooking=async(req,res)=>{
  const {bookingId}=req.body;
  if(!bookingId){
    return res.status(400).json({success:true,message:"Booking Id required for cancellation"})
  }

 const deletedBooking = await Booking.findByIdAndDelete(bookingId);

if (!deletedBooking) {
  return res.status(404).json({ message: 'Booking not found' });
}

res.status(200).json({ message: 'Booking deleted successfully' });



}

