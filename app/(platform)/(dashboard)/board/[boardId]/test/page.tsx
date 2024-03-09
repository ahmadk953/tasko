import { useMyPresence, useOthers } from '@/liveblocks.config';
import { Cursor } from './cursor';

const TestPage = () => {
  const [myPresence, updateMyPresence] = useMyPresence();

  const others = useOthers();

  function handlePointerMove(e: any) {
    const cursor = { x: Math.floor(e.clientX), y: Math.floor(e.clientY) };
    updateMyPresence({ cursor });
  }

  function handlePointerLeave() {
    updateMyPresence({ cursor: null });
  }

  return (
    <div
      style={{ width: '100vw', height: '100vh' }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      Cursor: {JSON.stringify(myPresence.cursor)}
      {others
        .filter((other) => other.presence.cursor !== null)
        .map(({ connectionId, presence }) => (
          <Cursor
            key={connectionId}
            // @ts-ignore
            x={presence.cursor.x}
            // @ts-ignore
            y={presence.cursor.y}
          />
        ))}
    </div>
  );
};

export default TestPage;
