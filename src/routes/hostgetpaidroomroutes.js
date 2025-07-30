import {Router} from 'express';
import {getPaidConfirmedBookings} from '../controllers/hostcontrollers.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router=Router();

router.route('/getpaidrooms').post(authMiddleware,getPaidConfirmedBookings);

export default router;