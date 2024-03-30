import { z } from 'zod';

export const CopyBoard = z.object({
  id: z.string(),
});
