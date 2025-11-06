import { db } from '@/lib/db';

import { auth, currentUser } from '@clerk/nextjs/server';
import { Liveblocks } from '@liveblocks/node';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { isAuthenticated, orgId } = await auth();
    const user = await currentUser();

    if (!isAuthenticated || !user) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { room } = await req.json();
    const boardId = (await headers()).get('BoardId') as string;

    if (!boardId) {
      return new Response(
        JSON.stringify({ error: 'BoardId header is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });

    if (!board || board.orgId !== orgId) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.LIVEBLOCKS_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'LIVEBLOCKS_SECRET_KEY is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const liveblocks = new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY,
    });

    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name: user.fullName || user.firstName || 'Anonymous',
        avatar: user.imageUrl,
      },
    });

    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();

    return new Response(body, { status });
  } catch (error) {
    console.error('Liveblocks auth error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
