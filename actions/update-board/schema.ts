import { z } from 'zod';

export const UpdateBoard = z.object({
  title: z
    .string({
      error: 'Title must be a string',
    })
    .min(3, {
      error: 'Title must be at least 3 characters',
    })
    .optional(),
  id: z.string(),
  image: z.optional(
    z.string({
      error: 'Image must be a string',
    })
  ),
});
