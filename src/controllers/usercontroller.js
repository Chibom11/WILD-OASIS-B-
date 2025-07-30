import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
})

import {User} from '../models/user.js'
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken'

async function generateAccessandRefreshTokens(userId){
    try {
        const user=await User.findById(userId)//the userId is the _id of the user document in the database.
        if(!user){
            throw new Error("User not found")

        }

        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave: false})//validateBeforeSave: false is used to skip validation before saving the user document. This is useful when you want to save a document without running the validation checks defined in the schema..in simple words it saves the user document without checking if the data is valid according to the schema.
        return {accessToken,refreshToken}
        
    } catch (error) {
        throw new Error(`Error generating tokens: ${error.message}`)
        
    }

}




export const registerUser = async (req, res) => {
    console.log("FILES: ", req.files);

    const { fullname, email, username, password } = req.body;

    // Validate required fields

    //some checks for atleast one element in array that satisfies the condition in callback function and returns true or false ...some((element,index)=>{}).....trim() method removes leading and trailing whitespaces from the given element..this is done to check whether the given details are not just blank spaces 
    if ([fullname, email, username, password].some((field) => !field?.trim())) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with email or username already exists",
            });
        }

        // the avatar file format that multer creates
        // req.files = {
        //   avatar: [
        //     {
        //       fieldname: 'avatar',
        //       originalname: 'myphoto.jpg',
        //       encoding: '7bit',
        //       mimetype: 'image/jpeg',
        //       destination: './public/temp',
        //       filename: 'avatar-1717268726385-123456789',
        //       path: 'public/temp/avatar-1717268726385-123456789',
        //       size: 12345
        //     }
        //   ]
        // }

        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        

        let avatar

        try {
            if (!avatarLocalPath) {
                return res.status(400).json({
                    success: false,
                    message: "Avatar file is missing",
                });
            }

            avatar = await uploadOnCloudinary(avatarLocalPath);
            console.log("Uploaded Avatar", avatar);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload avatar image",
            });
        }

   

        console.log("Creating user with values:", {
            fullname,
            email,
            avatar: avatar?.url,
           
            username,
        });

        // Create user
        const user = await User.create({
            fullname,
            avatar: avatar.url,
            email,
            password,
            username: username.toLowerCase(),
        });

        // Exclude password and refreshToken in response
        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            // Clean up images
            if (avatar) await deleteFromCloudinary(avatar.public_id);
          

            return res.status(500).json({
                success: false,
                message: "User creation failed",
            });
        }

        // Success response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: createdUser,
        });

    } catch (error) {
        console.error("Unexpected error during user registration:", error);

        // Clean up if something went wrong
        if (avatar) await deleteFromCloudinary(avatar.public_id);
       

        return res.status(500).json({
            success: false,
            message: "Something went wrong while registering the user",
        });
    }
};

export const loginUser=async (req,res)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password){
        return res.status(400).json({
            success:false,
            message:"Email and password are required"
        })
    }
    const user=await User.findOne({
        email:email.toLowerCase(),
        username:username,

    })
    if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found"
  });
}
    const isPasswordValid=await user?.isPasswordMatched(password);
    if(!isPasswordValid){
        return res.status(401).json(
            {
                success:false,
                mesage:"The Password You have entered is incorrect"
            }
        )
    }
    const tokens=await generateAccessandRefreshTokens(user._id);
    const accessToken=tokens.accessToken;
    const refreshToken=tokens.refreshToken;

    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false});//Saves the updated user document (with the new refreshToken) to the database.The option { validateBeforeSave: false } tells Mongoose not to run schema validations before saving.


    const loggedInUser=await User.findById(user._id).select("-password -refreshToken");// .select deselects the -password and -refreshtoken

     const options = {
    httpOnly: true,
    secure: true, 
    sameSite: 'none', 
  }
    return res.status(200).cookie('refreshToken',refreshToken,options).cookie('accessToken',accessToken,options).json({
        success:true,
        message:"User logged in successfully",
        user:loggedInUser,accessToken,refreshToken
    })

}

export const refreshAccessToken=async(req,res)=>{
    const storedrefreshToken=req.cookies.refreshToken;
    if(!storedrefreshToken){
        return res.status(401).json({
            success:false,
            message:"Refresh token is missing"
        })
    }

    const decodedToken=jwt.verify(storedrefreshToken,process.env.REFRESH_TOKEN_SECRET)

    const user=await User.findById(decodedToken._id);
    if(user.refreshToken!==storedrefreshToken){
        return res.status(403).json({
            success:false,
            message:"Invalid refreshToken"
        })
    }
    const tokens=await generateAccessandRefreshTokens(user._id);
    const newAccessToken=tokens.accessToken;
    const newRefreshToken=tokens.refreshToken;

    user.refreshToken=newRefreshToken;

    await user.save({validateBeforeSave:false});

      const options = {
    httpOnly: true,
    secure: true, 
    sameSite: 'none', 
  }

    return res.status(200).cookie('refreshToken',newRefreshToken,options).cookie('accessToken',newAccessToken,options).json({message:"Access token refreshed successfully",success:true,accessToken:newAccessToken,refreshToken:newRefreshToken})
}

export const logoutUser = async (req, res) => {

  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  // Clear refresh token from DB
  await User.findByIdAndUpdate(
    user._id,
    { $unset: { refreshToken: "" } }, // Use $unset to remove field
    { new: true }//new: true option returns the updated document
  );

  // Clear cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200)
    .json({
      success: true,
      message: "User logged out successfully",
    });
};


const updateAvatar=async (req,res)=>{

    const user=req.user;
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User not found"
        })
    }

    const prevAvatarUrl= await User.findById(user._id).select("avatar");//returns prevAvatarUrl= {avatar: "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890...}
    if(prevAvatarUrl.avatar){
        await deleteFromCloudinary(prevAvatarUrl.public_id)
    }
    
    const avatarLocalPath=req.files?.avatar?.[0]?.path;

    if(!avatarLocalPath){
        return res.status(400).json({
            success:false,
            message:"Avatar file is missing"
        })
    }

    let avatar;
    try {
        avatar=await uploadOnCloudinary(avatarLocalPath);

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Failed to upload avatar on cloudinary"
        })
        
    }

    await User.findByIdAndUpdate(user._id,{
        $set:{
            avatar:avatar.url
        },
        },{ new: true, }
    )

    return res.status(200).json({
        success:true,
        message:"Avatar updated successfully",
        avatar:avatar.url
    })

    


}

export const updateUserName=async(req,res)=>{

    //this is what auth.middleware.js is returning us and im using it to get that user detail from database
    const user=req.user;
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User not found"
        })
    }

    //this is the new username that the user wants to set..he will type this and we use post request in frontend to send this data to backend
    const {newUserName}=req.body;
    if(!newUserName || newUserName.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Valid username required"
        })
    }


    await User.findByIdAndUpdate(user._id,{
        $set:{
            username:newUserName.toLowerCase() 
        }
    },{ new: true, // new: true option returns the updated document
    })

    return res.status(200).json({
        success:true,
        message:"Username updated successfully",
        username:newUserName.toLowerCase()
    })


}
export const updatePassword = async (req, res) => {
  const userFromMiddleware = req.user;

  if (!userFromMiddleware) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  const { newPassword } = req.body;
  if (!newPassword || newPassword.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Valid password required",
    });
  }

  const user = await User.findById(userFromMiddleware._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does not exist",
    });
  }

  user.password = newPassword; 
  await user.save();// Triggers pre('save') hook...ensures bcrypt hashing is applied..check src/models/user.js for the pre-save hook

  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
};
