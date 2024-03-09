'use client';

import { ReactNode } from 'react';
import { RoomProvider } from '@/liveblocks.config';
import { ClientSideSuspense } from '@liveblocks/react';
import { useAuth } from '@clerk/nextjs';

const Room = ({ children }: { children: ReactNode }) => {
  const { orgId } = useAuth();

  if (!orgId) return null;

  return (
    <RoomProvider id={orgId} initialPresence={{ cursor: null }}>
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

export default Room;
