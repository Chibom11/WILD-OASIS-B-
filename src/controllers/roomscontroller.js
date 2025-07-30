import { Rooms } from "../models/rooms.js";

export const getrooms=async(req,res)=>{
    try {
        const rooms=await Rooms.find()
    
        return res.status(200).json({sucess:true,message:"Rooms fetched successfully", data:rooms})
    } catch (error) {
        console.log("Can't get rooms", error);
        return res.status(500).json({ message: "Server error: Could not fetch rooms" }); 
        
    }

}