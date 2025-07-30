import {Router}  from 'express'
import { logoutUser } from '../controllers/usercontroller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import { checkAccessToken } from "../middlewares/accesstoken.js";

const router=Router();

router.route('/logout').post(authMiddleware,logoutUser);

export default router;