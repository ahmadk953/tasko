'use server';

import { auth } from '@clerk/nextjs/server';

import { db } from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { CopyBoard } from './schema';
import { redirect } from 'next/navigation';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { id } = data;
  let board;

  try {
    const boardToCopy = await db.board.findUnique({
      where: {
        id,
        orgId,
      },
      include: {
        lists: true,
      },
    });

    if (!boardToCopy) return { error: 'Board not found' };

    board = await db.board.create({
      data: {
        title: `${boardToCopy.title} - Copy`,
        orgId,
        imageId: boardToCopy.imageId,
        imageThumbUrl: boardToCopy.imageThumbUrl,
        imageFullUrl: boardToCopy.imageFullUrl,
        imageLinkHTML: boardToCopy.imageLinkHTML,
        imageUserName: boardToCopy.imageUserName,
        imageDownloadUrl: boardToCopy.imageDownloadUrl,
        lists: {
          createMany: {
            data: boardToCopy.lists.map((list) => ({
              title: list.title,
              order: list.order,
            })),
          },
        },
      },
      include: {
        lists: true,
      },
    });
  } catch {
    return {
      error: 'Failed to create board',
    };
  }

  redirect(`/board/${board.id}`);
};

export const copyBoard = createSafeAction(CopyBoard, handler);
