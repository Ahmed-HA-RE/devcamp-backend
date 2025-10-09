import z from 'zod';

export const reviewSchema = z.object(
  {
    title: z
      .string({ error: 'title is required' })
      .trim()
      .nonempty({ error: 'Please add a title.' }),
    text: z
      .string({ error: 'text is required' })
      .nonempty({ error: 'Please add a text' }),
    rating: z.coerce
      .number({ error: 'Please add a rating from 1 till 10' })
      .min(1, { error: 'Minimum rating is 1' })
      .max(10, { error: 'Maximum rating is 10' })
      .nonoptional({ error: 'Please add a rating from 1 till 10' }),
    bootcamp: z.string(),
    user: z.string(),
  },
  { error: 'Please enter the fields in order to submit' }
);

export const updateReviewSchema = reviewSchema.partial();
