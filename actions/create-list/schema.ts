import { z } from 'zod';

export const CreateList = z.object({
  title: z
    .string({
      error: 'List title is required',
    })
    .min(2, {
      error: 'List title must be at least 2 characters',
    }),
  boardId: z.string(),
});
