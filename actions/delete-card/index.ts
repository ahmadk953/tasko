'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { DeleteCard } from './schema';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) return { error: 'Unauthorized' };

  const { id, boardId } = data;
  let card;

  try {
    card = await db.card.delete({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
      select: {
        id: true,
        title: true,
      },
    });

    await createAuditLog({
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      entityId: card.id,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return {
      error: 'Failed to delete card',
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const deleteCard = createSafeAction(DeleteCard, handler);
