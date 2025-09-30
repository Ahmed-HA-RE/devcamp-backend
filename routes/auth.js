import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.js';

const router = express.Router();

router.route('/register').post(registerUser); // POST /api/v1/auth/register
router.route('/login').post(loginUser); // POST /api/v1/auth/login

export default router;
