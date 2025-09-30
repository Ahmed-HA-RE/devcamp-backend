import z from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .nonempty({ error: 'Name cannot be empty' }),
  email: z
    .email({ error: 'Please enter a valid email' })
    .nonempty({ error: 'Email cannot be empty' }),
  role: z
    .enum(['user', 'publisher'], { error: 'Invalid role' })
    .prefault('user'),
  password: z
    .string({ error: 'Password is required' })
    .min(6, { error: 'Password must be at least 6 characters' })
    .max(30, { error: "Password can't be more than 30 characters" })
    .regex(/^(?=.*[a-z]).*$/, {
      error: 'Password must contain at least one lowercase character',
    })
    .regex(/^(?=.*[A-Z]).*$/, {
      error: 'Password must contain at least one UpperCase character',
    }),
});
