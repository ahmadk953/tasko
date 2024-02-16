import { z } from 'zod';

export const UpdateBoard = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .min(3, {
      message: 'Title must be at least 3 characters',
    }),
  id: z.string(),
});
