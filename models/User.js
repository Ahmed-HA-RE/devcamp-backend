import colors from '@colors/colors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import signJWT from '../utils/signJWTToken.js';
import crypto from 'crypto';

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
        values: ['user', 'publisher', 'admin'],
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
    resetPasswordExpire: Date,
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

// Match user entered password with the password that is in database?
userSchema.methods.matchPassword = async function (enteredPass) {
  return await bcrypt.compare(enteredPass, this.password);
};

// Reset and hash reset password token
userSchema.methods.getResetPassToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// Cascade delete the associated reviews when user is deletedfrom database
userSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function () {
    console.log(
      `Removing reviews associated with the deleted user: ${this.id}.`.red
    );
    await this.model('Review').deleteMany({ user: this._id });
  }
);

export const User = mongoose.model('User', userSchema);
