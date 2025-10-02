import z from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .nonempty({ error: 'Name cannot be empty' }),
  email: z
    .email({ error: 'Please enter a valid email' })
    .nonempty({ error: 'Email cannot be empty' }),
  role: z
    .enum(['user', 'publisher', 'admin'], { error: 'Invalid role' })
    .prefault('user'),
  password: z
    .string({ error: 'Password is required' })
    .min(6, { error: 'Password must be at least 6 characters' })
    .max(30, { error: "Password can't be more than 30 characters" }),
});

export const loginSchema = registerSchema.pick({ email: true, password: true });

// Schema for forgot password
export const forgotPassSchema = registerSchema.pick({ email: true });

// Schema for reset password
export const resetPassSchema = z.object({
  newPassword: z
    .string({ error: 'Password is required' })
    .min(6, { error: 'Password must be at least 6 characters' })
    .max(30, { error: "Password can't be more than 30 characters" }),
});

// Schema for updating user's data
export const updateUserSchema = registerSchema
  .omit({
    password: true,
    role: true,
  })
  .partial();
