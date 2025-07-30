import {Router} from 'express';
import {createHostProfile} from '../controllers/hostcontrollers.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router=Router();

router.route('/createhost').post(authMiddleware,createHostProfile);

export default router;