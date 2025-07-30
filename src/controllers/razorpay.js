import { Booking } from '../models/bookings.js'; // adjust path as needed
import Razorpay from "razorpay";
import crypto from 'crypto'
import dotenv from 'dotenv';
dotenv.config();

export const instance=new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

export const checkout = async (req, res) => {

  const {amount} =req.body;
  try {
    const options = {
      amount,
      currency: "INR",
    };

    const order = await instance.orders.create(options);
    console.log(order);
    res.status(200).json({success:true,order})
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
};



export const paymentverification = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
      paymentMethod = 'upi' // default fallback
    } = req.body;

    // Signature Verification
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // ✅ Update Booking if signature is valid
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: "completed",
        paymentMethod: paymentMethod,
        paidAt: new Date(), // ✅ Add the paidAt field
        
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and booking updated",
      booking,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Server error during verification" });
  }
};


