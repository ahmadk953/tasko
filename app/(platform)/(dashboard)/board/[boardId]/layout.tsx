import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { BoardNavbar } from './_components/board-navbar';
import { BoardLiveblocks } from './_components/board-liveblocks';
import { unstable_cache } from 'next/cache';

export async function generateMetadata(props: {
  params: Promise<{ boardId: string }>;
}) {
  const params = await props.params;
  const { orgId } = await auth();

  if (!orgId) return { title: 'Board' };

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  return {
    title: board?.title ?? 'Board',
  };
}

const BoardIdLayout = async (props: {
  children: React.ReactNode;
  params: Promise<{ boardId: string }>;
}) => {
  const params = await props.params;

  const { children } = props;

  const { orgId } = await auth();

  if (!orgId) redirect('/select-org');

  const getBoard = unstable_cache(
    async () => {
      return await db.board.findUnique({
        where: {
          id: params.boardId,
          orgId,
        },
      });
    },
    [`board-${params.boardId}`],
    {
      tags: [`board-${params.boardId}`],
      revalidate: false,
    }
  );

  const board = await getBoard();

  if (!board) notFound();

  return (
    <div
      className='relative h-full bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar data={board} />
      <div className='absolute inset-0 bg-black/10' />
      <main className='relative h-full pt-28'>
        <BoardLiveblocks boardId={params.boardId}>{children}</BoardLiveblocks>
      </main>
    </div>
  );
};

export default BoardIdLayout;
