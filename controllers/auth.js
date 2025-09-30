import asyncHandler from '../middleware/asyncHandler.js';
import { User } from '../models/User.js';
import { registerSchema } from '../schema/authSchema.js';

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
