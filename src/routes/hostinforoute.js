import {Router} from 'express';
import {getHostProfile } from '../controllers/hostcontrollers.js';
import { checkAccessToken } from '../middlewares/accesstoken.js';

const router=Router();

router.route('/hostinfo').post(checkAccessToken,getHostProfile);

export default router;