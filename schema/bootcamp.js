import z from 'zod';

export const bootcampSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .nonempty({ error: 'Name is required' })
    .min(3, { error: 'Name must contain at least 3 characters' })
    .max(20, { error: 'Name must not exceed 20 characters' }),
  slug: z.string().optional(),
  description: z
    .string({ error: 'Description is required' })
    .nonempty({ error: 'Description is required' })
    .max(500),
  email: z.email({ error: 'Please enter a valid email' }),
  phone: z.coerce
    .number({ error: 'Phone number is required' })
    .nonnegative({ error: 'Number can not be negative' })
    .gt(20, { error: 'Please enter a valid phone number' }),
  website: z.url({
    protocol:
      /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
    hostname: z.regexes.domain,
    error: 'Please enter a valid URL either HTTP or HTTPS',
  }),
  address: z
    .string({ error: 'Address is required' })
    .nonempty({ error: 'Address is required' }),
  careers: z.enum(
    [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other',
    ],
    { error: 'Field is required' }
  ),
  averageRating: z
    .number()
    .min(1, { error: 'Rating musst be at least 1' })
    .max(10, { error: "Rating can't be more than 10" }),
  averageCost: z.string(),
  photo: z.string().prefault('no-photo.jpg'),
  housing: z.boolean().prefault(false),
  jobAssistance: z.boolean().prefault(false),
  jobGuarantee: z.boolean().prefault(false),
  acceptGi: z.boolean().prefault(false),
});
