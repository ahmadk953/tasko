'use client';

import { useOthers, useMyPresence } from '@liveblocks/react/suspense';
import { Cursor } from './cursor';
import { colors } from '@/constants/colors';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const BoardRoomWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const others = useOthers();
  const ref = useRef<HTMLDivElement>(null);

  const [numbers, setNumbers] = useState<number[]>([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [myPresence, updateMyPresence] = useMyPresence();

  useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current.clientWidth);
      setHeight(ref.current.clientHeight);
    }
  }, [numbers]);

  useEffect(() => {
    function handleWindowResize() {
      if (ref.current) {
        setWidth(ref.current.clientWidth);
        setHeight(ref.current.clientHeight);
      }
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const normalizedCursorX = (e.clientX - rect.left) / rect.width;
    const normalizedCursorY = (e.clientY - rect.top) / rect.height;
    updateMyPresence({
      cursor: { x: normalizedCursorX, y: normalizedCursorY },
    });
  }

  function handlePointerLeave(e: React.PointerEvent<HTMLDivElement>) {
    updateMyPresence({ cursor: null });
  }
  return (
    <div
      className='relative h-full w-full'
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      ref={ref}
    >
      {children}
      {others.map(({ connectionId, presence }) => (
        <Cursor
          key={connectionId}
          x={(presence.cursor?.x as number) * width}
          y={(presence.cursor?.y as number) * height}
          color={colors[connectionId % colors.length]}
        />
      ))}
    </div>
  );
};
