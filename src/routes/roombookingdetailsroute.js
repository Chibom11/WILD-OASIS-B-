import {Router} from 'express'
import {getRoomBookingDetails} from '../controllers/bookingcontroller.js'
import { checkAccessToken } from '../middlewares/accesstoken.js';
const router=Router();

router.route('/roombookingdetails').get(checkAccessToken,getRoomBookingDetails)

export default router