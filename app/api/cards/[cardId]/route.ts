import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET(
  req: Request,
  props: { params: Promise<{ cardId: string }> }
) {
  const params = await props.params;
  try {
    const { orgId, userId } = await auth();

    if (!orgId || !userId)
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });

    const card = await db.card.findUnique({
      where: {
        id: params.cardId,
        list: {
          board: {
            orgId,
          },
        },
      },
      include: {
        list: {
          select: {
            title: true,
          },
        },
      },
      cacheStrategy: {
        ttl: 30,
        swr: 60,
      },
    });

    return new NextResponse(JSON.stringify(card), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
