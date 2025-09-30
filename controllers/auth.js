import asyncHandler from '../middleware/asyncHandler.js';
import { User } from '../models/User.js';
import { registerSchema, loginSchema } from '../schema/authSchema.js';
import bcrypt from 'bcryptjs';

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
  const user = await User.create(validatedData);

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
