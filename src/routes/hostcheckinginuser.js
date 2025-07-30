import {Router} from 'express';
import {setCheckedIn} from '../controllers/hostcontrollers.js';
import { checkAccessToken } from '../middlewares/accesstoken.js';

const router=Router();

router.route('/checkinuser').post(checkAccessToken,setCheckedIn);

export default router;