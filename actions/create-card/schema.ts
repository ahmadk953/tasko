import { z } from 'zod';

export const CreateCard = z.object({
  title: z
    .string({
      error: 'Card title is required',
    })
    .min(2, {
      error: 'Card title must be at least 2 characters',
    }),
  boardId: z.string(),
  listId: z.string(),
});
