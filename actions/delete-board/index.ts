'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';
import { decreaseAvailableCount } from '@/lib/org-limit';
import { checkSubscription } from '@/lib/subscription';

import { InputType, ReturnType } from './types';
import { DeleteBoard } from './schema';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) return { error: 'Unauthorized' };

  const isPro = await checkSubscription();

  const { id } = data;
  let board;

  try {
    board = await db.board.delete({
      where: {
        id,
        orgId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!isPro) {
      await decreaseAvailableCount();
    }

    await createAuditLog({
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      entityId: board.id,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return {
      error: 'Failed to delete board',
    };
  }

  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
