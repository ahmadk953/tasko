'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { UpdateBoard } from './schema';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) return { error: 'Unauthorized' };

  const { title, id, image } = data;
  let board;

  try {
    const currentBoard = await db.board.findUnique({
      where: {
        id,
        orgId,
      },
      select: {
        imageId: true,
        imageThumbUrl: true,
        imageFullUrl: true,
        imageUserName: true,
        imageLinkHTML: true,
        imageDownloadUrl: true,
      },
    });

    const currentImageString = `${currentBoard?.imageId}|${currentBoard?.imageThumbUrl}|${currentBoard?.imageFullUrl}|${currentBoard?.imageUserName}|${currentBoard?.imageLinkHTML}|${currentBoard?.imageDownloadUrl}`;

    const [
      imageId,
      imageThumbUrl,
      imageFullUrl,
      imageLinkHTML,
      imageUserName,
      imageDownloadUrl,
    ] = image?.split('|') || currentImageString.split('|');

    board = await db.board.update({
      where: {
        id,
        orgId,
      },
      data: {
        title,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
        imageDownloadUrl,
      },
    });

    await createAuditLog({
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      entityId: board.id,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    return {
      error: 'Failed to update board',
    };
  }

  revalidatePath(`/board/${id}`);
  return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
