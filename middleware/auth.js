import * as jose from 'jose';
import asyncHandler from './asyncHandler.js';
import { User } from '../models/User.js';
import { JWT_SECRET } from '../utils/encryptJWT.js';

const protect = asyncHandler(async (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders && !authHeaders?.startsWith('Bearer')) {
    const err = new Error('Not Authorized. No token provided');
    err.status = 401;
    throw err;
  }

  const token = authHeaders.split(' ')[1];

  const { payload } = await jose.jwtVerify(token, JWT_SECRET);

  const user = await User.findById(payload.id);

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  req.user = user;

  next();
});

export default protect;
