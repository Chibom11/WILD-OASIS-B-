import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const authMiddleware = async (req, res, next) => {
  const storedAccessToken = req.cookies.accessToken;
  if (!storedAccessToken) {
    return res.status(400).json({ success: false, message: "Access token is missing" });
  }

  try {
    const decodedAccessToken = jwt.verify(storedAccessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedAccessToken._id).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user; // Attach full user
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired access token" });
  }
};

export default authMiddleware;
