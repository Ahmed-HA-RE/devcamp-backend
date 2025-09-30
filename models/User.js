import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import signJWT from '../utils/signJWTToken.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Please add a name'], trim: true },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: [true, 'User already exists'],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please add a valid email'],
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'publisher'],
        default: 'user',
      },
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minLength: [6, 'Password must be at least 6 characters'],
      maxLength: [30, "Password can't be more than 30 characters"],
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
  },
  { timestamps: true }
);

// encrypt password using bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate a token
userSchema.methods.generateToken = async function () {
  const accessToken = await signJWT({ id: this._id.toString() }, '1m');
  const refreshToken = await signJWT({ id: this._id.toString() }, '30d');

  return { accessToken, refreshToken };
};

export const User = mongoose.model('User', userSchema);
