import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { Prisma } from '@/generated/prisma/client';
import { ListContainer } from './_components/list-container';
import { BoardRoomWrapper } from './_components/board-room-wrapper';

interface BoardIdPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

const BoardIdPage = async (props: BoardIdPageProps) => {
  const params = await props.params;
  const { orgId } = await auth();

  if (!orgId) {
    redirect('/select-org');
  }

  const lists = (await db.list.findMany({
    where: {
      boardId: params.boardId,
      board: {
        orgId,
      },
    },
    include: {
      cards: {
        orderBy: {
          order: 'asc',
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  })) as Prisma.ListGetPayload<{ include: { cards: true } }>[];

  return (
    <BoardRoomWrapper>
      <div className='h-full overflow-x-auto p-4'>
        <ListContainer boardId={params.boardId} data={lists} />
      </div>
    </BoardRoomWrapper>
  );
};

export default BoardIdPage;
