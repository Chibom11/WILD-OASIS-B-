import {Router} from 'express'
import { currenttrips } from '../controllers/bookingcontroller.js'

import authMiddleware from '../middlewares/auth.middleware.js';

const router=Router();

router.route('/currenttrips').get(authMiddleware,currenttrips)

export default router;