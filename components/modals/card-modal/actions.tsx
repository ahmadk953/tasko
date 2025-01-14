'use client';

import { Copy, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { deleteCard } from '@/actions/delete-card';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import { copyCard } from '@/actions/copy-card';

import { CardWithList } from '@/types';
import { useCardModal } from '@/hooks/use-card-modal';
import { DatePicker } from '@/components/ui/date-picker';

interface ActionsProps {
  data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams();
  const cardModal = useCardModal();

  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: () => {
        toast.success(`Card "${data.title}" deleted`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: () => {
        toast.success(`Card "${data.title}" copied`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const onCopy = () => {
    const boardId = params.boardId as string;

    executeCopyCard({
      id: data.id,
      boardId,
    });
  };

  const onDelete = () => {
    const boardId = params.boardId as string;

    executeDeleteCard({
      id: data.id,
      boardId,
    });
  };

  return (
    <div className='mt-2 space-y-2'>
      <p className='text-xs font-semibold'>Actions</p>
      <Button
        onClick={onCopy}
        disabled={isLoadingCopy}
        variant='gray'
        className='w-full justify-start'
        size='inline'
      >
        <Copy className='mr-2 h-4 w-4' />
        Copy
      </Button>
      <DatePicker
        type='dueDate'
        variant='gray'
        className='w-full justify-start text-black dark:text-white'
        size='inline'
        placeholder='Add Due Date'
        afterSelectText='Due '
        boardId={params.boardId as string}
        card={data}
      />
      <DatePicker
        type='startedAtDate'
        variant='gray'
        className='w-full justify-start text-black dark:text-white'
        size='inline'
        placeholder='Add Started Date'
        afterSelectText='Started '
        boardId={params.boardId as string}
        card={data}
      />
      <Button
        onClick={onDelete}
        disabled={isLoadingDelete}
        variant='gray'
        className='w-full justify-start text-destructive dark:text-red-500'
        size='inline'
      >
        <Trash className='mr-2 h-4 w-4' />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className='mt-2 space-y-2'>
      <Skeleton className='h-4 w-20 bg-neutral-200' />
      <Skeleton className='h-8 w-full bg-neutral-200' />
      <Skeleton className='h-8 w-full bg-neutral-200' />
    </div>
  );
};
