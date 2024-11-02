import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { Info } from '../_components/info';
import { ActivityList } from './_components/activity-list';

import { Separator } from '@/components/ui/separator';
import { checkSubscription } from '@/lib/subscription';
import { db } from '@/lib/db';
import { Skeleton } from '@/components/ui/skeleton';

const ActivityPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) => {
  const isPro = await checkSubscription();
  const { orgId } = await auth();
  const params = await searchParams;
  const currentPage = Number(params.page);
  const limit = 10;

  if (!orgId) redirect('/select-org');
  if (!currentPage || currentPage < 1) redirect('activity?page=1');

  const skip = (currentPage - 1) * limit;

  const auditLogs = await db.auditLog.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip,
    take: limit,
    cacheStrategy: { ttl: 30, swr: 60 },
  });

  const totalCount = await db.auditLog.count({
    where: {
      orgId,
    },
    cacheStrategy: { ttl: 30, swr: 60 },
  });

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className='w-full'>
      <Info isPro={isPro} />
      <Separator className='my-2' />
      <Suspense fallback={<ActivityListSkeleton />}>
        <ActivityList
          totalPages={totalPages}
          currentPage={currentPage}
          auditLogs={auditLogs}
        />
      </Suspense>
    </div>
  );
};

export default ActivityPage;

const ActivityListSkeleton = () => {
  return (
    <ol className='mt-4 space-y-4'>
      <Skeleton className='h-14 w-[80%]' />
      <Skeleton className='h-14 w-[50%]' />
      <Skeleton className='h-14 w-[70%]' />
      <Skeleton className='h-14 w-[80%]' />
      <Skeleton className='h-14 w-[75%]' />
    </ol>
  );
};
