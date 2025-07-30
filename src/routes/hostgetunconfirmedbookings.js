
import {Router} from 'express';
import {getUnConfirmedBookings } from '../controllers/hostcontrollers.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router=Router();

router.route('/getunconfirmedrooms').post(authMiddleware,getUnConfirmedBookings);

export default router;