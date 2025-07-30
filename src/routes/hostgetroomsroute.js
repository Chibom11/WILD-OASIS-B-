import {Router} from 'express';
import {getHostRooms} from '../controllers/hostcontrollers.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router=Router();

router.route('/gethostrooms').get(authMiddleware,getHostRooms);

export default router;