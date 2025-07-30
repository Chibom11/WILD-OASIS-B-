import { Router } from "express";
import { getrooms } from "../controllers/roomscontroller.js";
import { checkAccessToken } from "../middlewares/accesstoken.js";
const router=Router();

router.route('/rooms').get(checkAccessToken,getrooms); 


export default router

