import { auth } from '@clerk/nextjs/server';
import { ENTITY_TYPE } from '@prisma/client';
import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

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

    const getAuditLogs = unstable_cache(
      async () => {
        return await db.auditLog.findMany({
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
      },
      [`card-logs-${params.cardId}`],
      {
        tags: [`card-logs-${params.cardId}`],
        revalidate: false,
      }
    );

    const auditLogs = await getAuditLogs();

    return new NextResponse(JSON.stringify(auditLogs), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
