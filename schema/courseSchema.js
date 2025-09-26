import z from 'zod';

export const courseSchema = z.object({
  title: z
    .string({ error: 'This field must be a valid text value.' })
    .trim()
    .nonempty({ error: 'This field must be a valid text value.' }),
  description: z
    .string({ error: 'This field must be a valid text value.' })
    .nonempty({ error: 'Please add a description' }),
  weeks: z
    .string({ error: 'This field must be a valid text value.' })
    .nonempty({ error: 'Please add number of weeks' }),
  tuition: z
    .number({ error: 'Please enter a valid number.' })
    .nonnegative({ error: "Tuition can't be negative" })
    .nonoptional({ error: 'Please add a tuition cost' }),
  minimumSkill: z.enum(['beginner', 'intermediate', 'advanced'], {
    error: 'Please enter a valid skill: Beginner, Intermediate or Advanced',
  }),
  scholarshipAvailable: z
    .boolean({
      error: 'Please choose either true or false',
    })
    .prefault(false),
});

export const updateCourseSchema = courseSchema.partial();
