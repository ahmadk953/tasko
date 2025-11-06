'use client';

import { Copy, ToolCaseIcon, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { memo, useCallback } from 'react';

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

const ActionsComponent = ({ data }: ActionsProps) => {
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

  const onCopy = useCallback(() => {
    const boardId = params.boardId as string;

    executeCopyCard({
      id: data.id,
      boardId,
    });
  }, [data.id, params.boardId, executeCopyCard]);

  const onDelete = useCallback(() => {
    const boardId = params.boardId as string;

    executeDeleteCard({
      id: data.id,
      boardId,
    });
  }, [data.id, params.boardId, executeDeleteCard]);

  return (
    <div className='space-y-3 border-neutral-200 pt-4 pl-0 lg:border-l lg:pt-0 lg:pl-6 dark:border-neutral-700'>
      <div className='flex items-center gap-2'>
        <ToolCaseIcon className='text-foreground h-6 w-6 flex-shrink-0' />
        <h3 className='text-foreground text-lg font-semibold'>Actions</h3>
      </div>
      <div className='flex flex-col space-y-1.5'>
        <Button
          onClick={onCopy}
          disabled={isLoadingCopy}
          variant='gray'
          className='w-full justify-start py-2 hover:cursor-pointer'
          size='sm'
        >
          <Copy className='mr-2 h-4 w-4' />
          Copy
        </Button>
        <DatePicker
          type='dueDate'
          variant='gray'
          className='w-full justify-start py-2 text-black hover:cursor-pointer dark:text-white'
          size='sm'
          placeholder='Add Due Date'
          afterSelectText='Due '
          boardId={params.boardId as string}
          card={data}
        />
        <DatePicker
          type='startedAtDate'
          variant='gray'
          className='w-full justify-start py-2 text-black hover:cursor-pointer dark:text-white'
          size='sm'
          placeholder='Add Started Date'
          afterSelectText='Started '
          boardId={params.boardId as string}
          card={data}
        />
        <Button
          onClick={onDelete}
          disabled={isLoadingDelete}
          variant='gray'
          className='text-destructive w-full justify-start hover:cursor-pointer dark:text-red-500'
          size='sm'
        >
          <Trash className='mr-2 h-4 w-4' />
          Delete
        </Button>
      </div>
    </div>
  );
};

const ActionsMemo = memo(ActionsComponent);

export const Actions = Object.assign(ActionsMemo, {
  Skeleton: function ActionsSkeleton() {
    return (
      <div className='space-y-3 pt-4 pl-0 lg:border-l lg:pt-0 lg:pl-6'>
        <Skeleton className='h-4 w-20 bg-neutral-200' />
        <div className='space-y-2'>
          <Skeleton className='h-8 w-full bg-neutral-200' />
          <Skeleton className='h-8 w-full bg-neutral-200' />
          <Skeleton className='h-8 w-full bg-neutral-200' />
          <Skeleton className='h-8 w-full bg-neutral-200' />
        </div>
      </div>
    );
  },
});
