import {Router} from 'express';
import {setCheckedOut} from '../controllers/hostcontrollers.js';
import { checkAccessToken } from '../middlewares/accesstoken.js';

const router=Router();

router.route('/checkoutuser').post(checkAccessToken,setCheckedOut);

export default router;