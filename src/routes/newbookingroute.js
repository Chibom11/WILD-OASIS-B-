import {Router} from 'express'
import { registerNewBooking } from '../controllers/bookingcontroller.js'
import authMiddleware from '../middlewares/auth.middleware.js';
import { checkAccessToken } from '../middlewares/accesstoken.js';

const router=Router();

router.post('/newbooking',checkAccessToken,registerNewBooking);

export default router;