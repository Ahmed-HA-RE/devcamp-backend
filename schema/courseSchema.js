import z from 'zod';

export const courseSchema = z.object(
  {
    title: z
      .string({ error: 'This field must be a valid text value.' })
      .trim()
      .nonempty({ error: 'This field must be a valid text value.' }),
    description: z
      .string({ error: 'This field must be a valid text value.' })
      .nonempty({ error: 'Please add a description' }),
    weeks: z.number({ error: 'This field must be a valid number value.' }),
    tuition: z
      .number({ error: 'Please enter a valid number.' })
      .nonnegative({ error: "Tuition can't be negative" })
      .nonoptional({ error: 'Please add a tuition cost' }),
    minimumSkill: z.enum(['beginner', 'intermediate', 'advanced'], {
      error: 'Please enter a valid skill: Beginner, Intermediate or Advanced',
    }),
    bootcamp: z.string().optional(),
    scholarshipAvailable: z
      .boolean({
        error: 'Please choose either true or false',
      })
      .prefault(false),
  },
  { error: 'Please enter the fields in order to submit' }
);

export const updateCourseSchema = courseSchema.partial();
