'use client';

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from '@liveblocks/react';
import { Skeleton } from '@/components/ui/skeleton';

export const BoardLiveblocks = ({
  children,
  boardId,
}: {
  children: React.ReactNode;
  boardId: string;
}) => {
  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        const headers = {
          'Content-Type': 'application/json',
          BoardId: `${boardId}`,
        };

        const body = JSON.stringify({
          room,
        });

        const response = await fetch('/api/liveblocks-auth', {
          method: 'POST',
          headers,
          body,
        });

        return await response.json();
      }}
      throttle={16}
    >
      <RoomProvider id={`${boardId}`} initialPresence={{ cursor: null }}>
        <ClientSideSuspense fallback={<BoardLiveblocks.Skeleton />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

BoardLiveblocks.Skeleton = function SkeletonBoardLiveblocks() {
  return (
    <div className='h-full overflow-x-auto p-4'>
      <ol className='flex h-full gap-x-3'>
        <li className='h-full w-[272px] shrink-0 select-none'>
          <div className='w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md'>
            <div className='flex items-start justify-between gap-x-2 px-2 pt-2 text-sm font-semibold'>
              <Skeleton className='h-7 truncate border-transparent bg-transparent px-[7px] py-1 text-sm font-medium' />
            </div>
            <ol className='mx-1 mt-2 flex flex-col gap-y-2 px-1 py-0.5'>
              <Skeleton className='h-12 space-y-2 truncate rounded-md border-2 border-transparent bg-white px-3 py-2 text-sm shadow-sm' />
              <Skeleton className='h-24 space-y-2 truncate rounded-md border-2 border-transparent bg-white px-3 py-2 text-sm shadow-sm' />
              <Skeleton className='h-16 space-y-2 truncate rounded-md border-2 border-transparent bg-white px-3 py-2 text-sm shadow-sm' />
            </ol>
          </div>
        </li>
        <div className='w-1 flex-shrink-0' />
      </ol>
    </div>
  );
};
