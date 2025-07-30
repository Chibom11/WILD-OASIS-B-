import express from 'express';
import { createRoom } from '../controllers/hostcontrollers.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.js'; // path to your multer setup

const router = express.Router();

router.post(
  '/addroom',
  authMiddleware,
  upload.fields([
    { name: 'cabin_img', maxCount: 5 },
    { name: 'bathroom_img', maxCount: 5 },
    { name: 'balcony_img', maxCount: 5 },
  ]),
  createRoom
);

export default router;
