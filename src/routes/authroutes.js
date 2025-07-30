import {Router} from 'express'
import { refreshAccessToken } from '../controllers/usercontroller.js'
const router=Router();

router.route('/refresh-token').get(refreshAccessToken);

export default router;