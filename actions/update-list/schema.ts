import { z } from 'zod';

export const UpdateList = z.object({
  title: z
    .string({
      error: 'Title must be a string',
    })
    .min(2, {
      error: 'Title must be at least 2 characters',
    }),
  id: z.string(),
  boardId: z.string(),
});
