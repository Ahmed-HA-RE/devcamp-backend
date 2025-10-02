import asyncHandler from '../middleware/asyncHandler.js';
import { User } from '../models/User.js';

// @route              GET /api/v1/users
// @desc               Get all users
// @access             Private
export const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @route              GET /api/v1/users/:id
// @desc               Get single user
// @access             Private
export const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json({ success: true, data: user });
});

// @route              POST /api/v1/users
// @desc               Create user
// @access             Private
export const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// @route              PUT /api/v1/users/:id
// @desc               Update user
// @access             Private
export const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});

// @route              DELETE /api/v1/users/:id
// @desc               Delete user
// @access             Private
export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.status(200).json({ success: true });
});
