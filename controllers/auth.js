import asyncHandler from '../middleware/asyncHandler.js';
import { User } from '../models/User.js';
import {
  registerSchema,
  loginSchema,
  resetPassSchema,
  updateUserSchema,
  forgotPassSchema,
} from '../schema/authSchema.js';
import * as jose from 'jose';
import { JWT_SECRET } from '../utils/encryptJWT.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

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

// @route              PUT/api/v1/forgotpassword
// @desc               Forgot password
// @access             Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    const err = new Error(
      'Please enter your email to reset your current password'
    );
    err.status = 400;
    throw err;
  }

  const validatedEmail = forgotPassSchema.parse(req.body);

  const user = await User.findOne({ email: validatedEmail.email });

  if (!user) {
    const err = new Error("User with this email dosen't exists");
    err.status = 401;
    throw err;
  }

  const resetToken = user.getResetPassToken();

  await user.save();

  const resetUrl = `${req.protocol}://${req.host}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you requested to reset your password. Please make a PUT request to: \n\n ${resetUrl}`;

  await sendEmail({
    email: user.email,
    subject: 'Password reset token',
    message,
  });

  res.status(200).json({ success: true });
});

// @route              PUT /api/v1/resetpassword/:resettoken
// @desc               Reset Password
// @access             Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { resettoken } = req.params;

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('-password');

  console.log(user);

  if (!user) {
    const err = new Error('Invalid Token');
    err.status = 400;
    throw err;
  }

  if (!req.body) {
    const err = new Error('Please enter your new password');
    err.status = 400;
    throw err;
  }

  user.password = req.body.password;

  (user.resetPasswordToken = undefined), (user.resetPasswordExpire = undefined);
  await user.save();

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

  res.status(200).json({
    success: true,
    accessToken,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @route              PUT /api/v1/update-details
// @desc               Update user's details
// @access             Private
export const updateUserDetails = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    const err = new Error(
      'Please provide the email or name you wanna change to'
    );
    err.status = 400;
    throw err;
  }

  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const validatedData = updateUserSchema.parse(fieldsToUpdate);

  const user = await User.findByIdAndUpdate(req.user.id, validatedData, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({ success: true, data: user });
});

// @route              PUT /api/v1/update-password
// @desc               Update authenticated user's password
// @access             Private
export const updateUserPassord = asyncHandler(async (req, res, next) => {
  if (!req.body || !req.body.currentPassword || !req.body.newPassword) {
    const err = new Error(
      'Please provide both your current password and the new password to update. '
    );
    err.status = 400;
    throw err;
  }

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(req.body.currentPassword))) {
    const err = new Error('Invalid Credentials');
    err.status = 400;
    throw err;
  }

  const validatedNewPass = resetPassSchema.parse(req.body);
  user.password = validatedNewPass.newPassword;
  user.save();

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

  res.status(200).json({
    success: true,
    accessToken,
  });
});
