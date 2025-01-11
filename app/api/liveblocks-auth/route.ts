import { db } from '@/lib/db';

import { auth, currentUser } from '@clerk/nextjs/server';
import { Liveblocks } from '@liveblocks/node';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const { sessionClaims } = await auth();
  const user = await currentUser();
  if (!sessionClaims || !user) {
    return new Response('Not authorized', { status: 401 });
  }

  const { room } = await req.json();
  const boardId = (await headers()).get('BoardId') as string;
  const board = await db.board.findUnique({
    where: {
      id: boardId,
      orgId: sessionClaims.org_id,
    },
  });
  if (!board || board.orgId !== sessionClaims.org_id) {
    return new Response('Not authorized', { status: 401 });
  }

  const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
  });
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.fullName!,
      avatar: user.imageUrl,
    },
  });
  session.allow(room, session.FULL_ACCESS);
  const { body, status } = await session.authorize();

  return new Response(body, { status });
}
