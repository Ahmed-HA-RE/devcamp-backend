import express from 'express';
import { registerUser } from '../controllers/auth.js';

const router = express.Router();

router.route('/register').post(registerUser); // POST /api/v1/auth/register

export default router;
