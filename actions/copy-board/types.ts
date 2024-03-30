import { z } from 'zod';
import { Board } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';
import { CopyBoard } from './schema';

export type InputType = z.infer<typeof CopyBoard>;
export type ReturnType = ActionState<InputType, Board>;
