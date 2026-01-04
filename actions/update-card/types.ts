import { z } from 'zod';
import { Card } from '@/generated/prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { UpdateCard } from './schema';

export type InputType = z.infer<typeof UpdateCard>;
export type ReturnType = ActionState<InputType, Card>;
