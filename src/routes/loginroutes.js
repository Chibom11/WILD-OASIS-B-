import {Router}  from 'express'
import { loginUser } from '../controllers/usercontroller.js'
import {upload} from '../middlewares/multer.js'
const router=Router();

router.route('/login').post(
    upload.fields([
        {
            name:'avatar',
            maxCount:1
        }

    ]),
    loginUser) 

export default router