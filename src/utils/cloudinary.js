import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({
  path: './.env'  // ✅ Make sure this path is correct
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Optional: Debug to verify environment variables
console.log("Cloudinary ENV Vars:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ present' : '❌ missing'
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    });

    fs.unlinkSync(localFilePath); // remove file from server
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove failed file
    throw error;
  }
};


export const deleteFromCloudinary=async (publicid)=>{
    try {
        await cloudinary.uploader.destroy(publicid);
        console.log("deleted from cloudinary")
        
    } catch (error) {
        console.log("Error deleting from cloudinary ",error)
        return null;
        
    }
}

