import { ZodError } from 'zod';
import z from 'zod';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose invalid id error
  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      message: `Resource not found.`,
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(
      (err) => err.properties.message
    );
    return res
      .status(400)
      .json({ success: false, messages: messages.join(', ') });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res
      .status(400)
      .json({ success: false, message: 'Duplicate field entered' });
  }

  // Zod invalid schema error
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ success: false, errors: z.flattenError(err).fieldErrors });
  }

  // Multer error triggered if the user attempts to upload multiple photos
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res
      .status(400)
      .json({ success: false, message: 'Only allowed to upload 1 photo' });
  }

  // Multer error triggered if the user attempts to upload photo that exceed 5mb
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Only allowed to upload photo within 5mb',
    });
  }

  // jose error if JWT Token is invalid
  if (err.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
    return res
      .status(401)
      .json({ message: 'Token is invalid or has been tampered with' });
  }
  // jose error if JWT Token ha expired
  if (err.code === 'ERR_JWT_EXPIRED') {
    return res
      .status(401)
      .json({ message: 'Token expired. Please login again.' });
  }

  res.status(err.status || 500).json({ success: false, message: err.message });
};
