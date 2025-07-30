import {Router} from 'express'
import {updatePassword} from '../controllers/usercontroller.js'
import authMiddleware from '../middlewares/auth.middleware.js';
import { checkAccessToken } from "../middlewares/accesstoken.js";
const router=Router();

router.post('/update-password',authMiddleware,updatePassword)

export default router;