import express from 'express';
import { registerUser, loginUser, refreshToken } from '../controllers/auth.js';

const router = express.Router();

router.route('/register').post(registerUser); // POST /api/v1/auth/register
router.route('/login').post(loginUser); // POST /api/v1/auth/login
router.route('/refresh').post(refreshToken); // POST /api/v1/auth/refresh

export default router;
