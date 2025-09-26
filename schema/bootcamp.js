import z from 'zod';

export const bootcampSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .nonempty({ error: 'Name is required' })
    .min(3, { error: 'Name must contain at least 3 characters' })
    .max(30, { error: 'Name must not exceed 20 characters' }),
  description: z
    .string({ error: 'Description is required' })
    .nonempty({ error: 'Description is required' })
    .max(500),
  email: z.email({ error: 'Please enter a valid email' }),
  phone: z
    .string({ error: 'Phone number is required' })
    .regex(/^((\+971|00971){1}(2|3|4|6|7|9|50|51|52|55|56){1}([0-9]{7}))$/, {
      error: 'Please enter a valid UAE phone number',
    }),
  website: z
    .string()
    .regex(
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
      { error: 'Please enter a valid URL either HTTP or HTTPS' }
    ),
  address: z
    .string({ error: 'Address is required' })
    .nonempty({ error: 'Address is required' }),
  careers: z.array(
    z.literal(
      [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other',
      ],
      { error: 'Please choose one of the provided fields only' }
    ),
    { error: 'Please choose one of the provided fields' }
  ),
  photo: z.string().prefault('no-photo.jpg'),
  housing: z
    .boolean({
      error:
        'Please specify if the housing is available or not by choosing only true or false',
    })
    .prefault(false),
  jobAssistance: z
    .boolean({
      error:
        'Please specify if job assistance is available or not by choosing only true or false',
    })
    .prefault(false),
  jobGuarantee: z
    .boolean({
      error:
        'Please specify if job guarantee is available or not by choosing only true or false',
    })
    .prefault(false),
  acceptGi: z
    .boolean({
      error:
        'Please specify if the GI Bill is available or not by choosing only true or false',
    })
    .prefault(false),
});

// schema for PUT HTTP method
export const updatedBootcampSchema = bootcampSchema.partial();
