import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

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

    const getCard = unstable_cache(
      async () => {
        return await db.card.findUnique({
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
        });
      },
      [`card-${params.cardId}`],
      {
        tags: [`card-${params.cardId}`],
        revalidate: false,
      }
    );

    const card = await getCard();

    return new NextResponse(JSON.stringify(card), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
