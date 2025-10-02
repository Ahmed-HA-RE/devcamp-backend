import express from 'express';
import {
  registerUser,
  loginUser,
  refreshToken,
  logout,
  getMe,
  resetPassword,
  forgotPassword,
} from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/register').post(registerUser); // POST /api/v1/auth/register
router.route('/login').post(loginUser); // POST /api/v1/auth/login
router.route('/logout').post(logout); // POST /api/v1/auth/logout
router.route('/refresh').post(refreshToken); // POST /api/v1/auth/refresh
router.route('/forgotpassword').put(forgotPassword); // PUT /api/v1/auth/forgotpassword
router.route('/resetpassword/:resettoken').put(resetPassword); // PUT /api/v1/auth/resetpassword/:resettoken
router.route('/me').get(protect, getMe); // GET /api/v1/auth/me

export default router;
