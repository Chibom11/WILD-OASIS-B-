// routes/user.routes.js
import { Router } from 'express';
import { updateUserName} from '../controllers/usercontroller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { checkAccessToken } from "../middlewares/accesstoken.js";

const router = Router();

// Routes for user updates

router.post('/update-username',authMiddleware, updateUserName);


export default router;
