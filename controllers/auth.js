import asyncHandler from '../middleware/asyncHandler.js';
import { User } from '../models/User.js';
import { registerSchema, loginSchema } from '../schema/authSchema.js';
import * as jose from 'jose';
import { JWT_SECRET } from '../utils/encryptJWT.js';

// @route              POST /api/v1/auth/register
// @desc               Register user
// @access             Public
export const registerUser = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    const err = new Error('Please add a name, email, password and role');
    err.status = 400;
    throw err;
  }

  const { name, email, password, role } = req.body;

  const validatedData = registerSchema.parse({ name, email, password, role });

  const isUserAvailable = await User.findOne({ email });

  if (isUserAvailable) {
    const err = new Error('User already exists');
    err.status = 400;
    throw err;
  }

  const user = await User.create(validatedData);

  // Create access token
  const { accessToken } = await user.generateToken();

  // Create refresh token
  const { refreshToken } = await user.generateToken();
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production' ? true : false,
  });

  res.status(201).json({
    succes: true,
    data: {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

// @route              POST /api/v1/auth/login
// @desc               login a user
// @access             Public
export const loginUser = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    const err = new Error('Please add your email and password');
    err.status = 400;
    throw err;
  }

  const { email, password } = req.body;

  const validatedData = loginSchema.parse({ email, password });

  const user = await User.findOne({ email: validatedData.email }).select(
    '+password'
  );

  if (!user) {
    const err = new Error('Invalid Credentials');
    err.status = 401;
    throw err;
  }

  const isMatchedPass = await user.matchPassword(password);

  if (!isMatchedPass) {
    const err = new Error('Invalid Credentials');
    err.status = 401;
    throw err;
  }

  // Create access token
  const { accessToken } = await user.generateToken();

  // Create refresh token
  const { refreshToken } = await user.generateToken();
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production' ? true : false,
  });

  res.status(201).json({
    succes: true,
    data: {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

// @route              POST /api/v1/auth/logout
// @desc               Clear token
// @access             Private
export const logout = asyncHandler(async (req, res, next) => {
  res
    .clearCookie('refreshToken')
    .status(200)
    .json({ message: 'Succesfully Logged Out' });
});

// @route              POST /api/v1/auth/refresh
// @desc               Refresh a user's token
// @access             Private
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    const err = new Error('No token provided');
    err.status = 401;
    throw err;
  }

  const { payload } = await jose.jwtVerify(refreshToken, JWT_SECRET);

  const user = await User.findById(payload.id);

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  // Create access token
  const { accessToken } = await user.generateToken();

  res.status(201).json({
    succes: true,
    data: {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

// @route              GET /api/v1/me
// @desc               Get user info
// @access             Private
export const getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user);
});
