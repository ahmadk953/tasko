import { z } from 'zod';

export const UpdateCard = z.object({
  boardId: z.string(),
  description: z.optional(
    z
      .string({
        error: 'Description must be a string',
      })
      .min(3, {
        error: 'Description must be at least 3 characters',
      })
  ),
  title: z.optional(
    z
      .string({
        error: 'Title must be a string',
      })
      .min(3, {
        error: 'Title must be at least 3 characters',
      })
  ),
  dueDate: z.optional(
    z.date({
      error: 'Due date must be a date',
    })
  ),
  startedAt: z.optional(
    z.date({
      error: 'Started at must be a date',
    })
  ),
  id: z.string(),
});
