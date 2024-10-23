import { auth } from '@clerk/nextjs/server';
import { ENTITY_TYPE } from '@prisma/client';
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

    const auditLogs = await db.auditLog.findMany({
      where: {
        orgId,
        entityId: params.cardId,
        entityType: ENTITY_TYPE.CARD,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });

    return NextResponse.json(auditLogs);
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
