'use client';

import { AuditLog } from '@prisma/client';
import { ActivityIcon } from 'lucide-react';
import { memo } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { ActivityItem } from '@/components/activity-item';

interface ActivityProps {
  items: AuditLog[];
}

const ActivityComponent = ({ items }: ActivityProps) => {
  return (
    <div className='flex w-full items-start gap-x-4'>
      <ActivityIcon className='text-foreground mt-0.5 h-6 w-6 flex-shrink-0' />
      <div className='min-w-0 flex-1'>
        <h3 className='text-foreground mb-4 text-lg font-semibold'>Activity</h3>
        <ol className='space-y-3'>
          {items.length === 0 && (
            <p className='text-muted-foreground py-2 text-sm'>
              No activity yet
            </p>
          )}
          {items.map((item) => (
            <ActivityItem key={item.id} data={item} />
          ))}
        </ol>
      </div>
    </div>
  );
};

const ActivityMemo = memo(ActivityComponent);

export const Activity = Object.assign(ActivityMemo, {
  Skeleton: function ActivitySkeleton() {
    return (
      <div className='flex w-full items-start gap-x-3'>
        <Skeleton className='bg-muted mt-1 h-5 w-5 flex-shrink-0 rounded-full' />
        <div className='w-full'>
          <Skeleton className='bg-muted mb-3 h-5 w-24 rounded-md' />
          <div className='space-y-1'>
            <Skeleton className='bg-muted h-12 w-full rounded-lg' />
            <Skeleton className='bg-muted h-12 w-full rounded-lg' />
            <Skeleton className='bg-muted h-12 w-full rounded-lg' />
          </div>
        </div>
      </div>
    );
  },
});
