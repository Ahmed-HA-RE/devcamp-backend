import * as jose from 'jose';
import asyncHandler from './asyncHandler.js';
import { User } from '../models/User.js';
import { JWT_SECRET } from '../utils/encryptJWT.js';

export const protect = asyncHandler(async (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders && !authHeaders?.startsWith('Bearer')) {
    const err = new Error('Not Authorized');
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

export const authorizeRole = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const err = new Error(
        `User with role of ${req.user.role} dosen't have permission to access that`
      );
      err.status = 403;
      throw err;
    }
    next();
  });
