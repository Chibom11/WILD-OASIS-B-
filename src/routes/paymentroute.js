import {Router} from 'express';
import {checkout,paymentverification} from '../controllers/razorpay.js'

const router=Router();

router.route('/checkout').post(checkout);
router.route('/paymentverification').post(paymentverification);

export default router;