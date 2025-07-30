// routes/checkavailabilityroute.js
import { Router } from "express";
import { isRoomAvailable } from "../controllers/bookingcontroller.js";
import { checkAccessToken } from "../middlewares/accesstoken.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/isavailable", checkAccessToken, isRoomAvailable);

export default router;
