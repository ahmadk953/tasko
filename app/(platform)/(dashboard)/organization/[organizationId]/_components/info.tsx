'use client';

import Image from 'next/image';
import { CreditCard } from 'lucide-react';

import { useOrganization } from '@clerk/nextjs';
import { Skeleton } from '@/components/ui/skeleton';

interface InfoProps {
  isPro: boolean;
}

export const Info = ({ isPro }: InfoProps) => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <Info.Skeleton />;
  }

  return (
    <div className='flex items-center gap-x-4'>
      <div className='relative h-[60px] w-[60px]'>
        {organization?.imageUrl ? (
          <Image
            fill
            src={organization.imageUrl}
            alt='Organization Logo'
            className='rounded-md object-cover'
          />
        ) : (
          <div
            className='bg-muted-foreground/10 h-full w-full rounded-md'
            aria-hidden
          />
        )}
      </div>
      <div className='space-y-1'>
        <p className='text-xl font-semibold'>{organization?.name}</p>
        <div className='text-muted-foreground flex items-center text-xs'>
          <CreditCard className='mr-1 h-3 w-3' />
          {isPro ? 'Pro' : 'Free'}
        </div>
      </div>
    </div>
  );
};

Info.Skeleton = function SkeletonInfo() {
  return (
    <div className='flex items-center gap-x-4'>
      <div className='relative h-[60px] w-[60px]'>
        <Skeleton className='absolute h-full w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-10 w-[200px]' />
        <div className='flex items-center'>
          <Skeleton className='mr-2 h-4 w-4' />
          <Skeleton className='h-4 w-[100px]' />
        </div>
      </div>
    </div>
  );
};
