import {Router} from 'express'
import { cancelBooking } from '../controllers/bookingcontroller.js'
import { checkAccessToken } from '../middlewares/accesstoken.js';

const router = Router();

router.post("/cancelbooking", checkAccessToken, cancelBooking);

export default router;