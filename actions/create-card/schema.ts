import { z } from 'zod';

export const CreateCard = z.object({
  title: z
    .string({
      required_error: 'Card title is required',
      invalid_type_error: 'Card title must be a string',
    })
    .min(2, {
      message: 'Card title must be at least 2 characters',
    }),
  boardId: z.string(),
  listId: z.string(),
});
