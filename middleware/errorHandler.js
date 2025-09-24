import { ZodError } from 'zod';
import z from 'zod';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose invalid id error
  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      message: `Resource not found with the id of ${err.value}`,
    });
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

  res.status(err.status || 500).json({ success: false, message: err.message });
};
