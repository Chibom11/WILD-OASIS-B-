import {Router} from 'express'
import { pasttrips } from '../controllers/bookingcontroller.js'

import authMiddleware from '../middlewares/auth.middleware.js';

const router=Router();

router.route('/pasttrips').get(authMiddleware,pasttrips)

export default router;