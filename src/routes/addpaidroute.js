import {Router} from 'express'
import {markbookingAsPaid} from '../controllers/hostcontrollers.js'
import { checkAccessToken } from '../middlewares/accesstoken.js';

const router=Router();

router.route('/paid').post(checkAccessToken,markbookingAsPaid);

export default router;