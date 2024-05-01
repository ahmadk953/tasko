'use client';

import { MoreHorizontal, X } from 'lucide-react';
import { toast } from 'sonner';

import { deleteBoard } from '@/actions/delete-board';
import { useAction } from '@/hooks/use-action';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { copyBoard } from '@/actions/copy-board';
import { BoardUpdateImage } from './board-update-image';

interface BoardOptionsProps {
  id: string;
}

export const BoardOptions = ({ id }: BoardOptionsProps) => {
  const { execute: executeDelete, isLoading: isLoadingDelete } = useAction(
    deleteBoard,
    {
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const { execute: executeCopy, isLoading: isLoadingCopy } = useAction(
    copyBoard,
    {
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const onDelete = () => {
    executeDelete({ id });
  };

  const onCopy = () => {
    executeCopy({ id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className='h-auto w-auto p-2' variant='transparent'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='px-0 pb-3 pt-3' side='bottom' align='start'>
        <div className='pb-4 text-center text-sm font-medium text-neutral-600'>
          Board Actions
        </div>
        <PopoverClose asChild>
          <Button
            className='absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600'
            variant='ghost'
          >
            <X className='h-4 w-4' />
          </Button>
        </PopoverClose>
        <Button
          variant='ghost'
          onClick={onCopy}
          disabled={isLoadingCopy}
          className='h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal text-neutral-600'
        >
          Copy this Board
        </Button>
        <BoardUpdateImage boardId={id} />
        <Button
          variant='ghost'
          onClick={onDelete}
          disabled={isLoadingDelete}
          className='h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal text-destructive hover:text-destructive'
        >
          Delete this Board
        </Button>
      </PopoverContent>
    </Popover>
  );
};
