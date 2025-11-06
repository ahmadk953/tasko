'use client';

import { MoreHorizontal } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';
import { List } from '@prisma/client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FormSubmit } from '@/components/form/form-submit';
import { Separator } from '@/components/ui/separator';
import { useAction } from '@/hooks/use-action';
import { deleteList } from '@/actions/delete-list';
import { copyList } from '@/actions/copy-list';

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

export const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: () => {
      toast.success(`List "${data.title}" deleted`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: () => {
      toast.success(`List "${data.title}" copied`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDelete = (formData: FormData) => {
    const id = formData.get('id') as string;
    const boardId = formData.get('boardId') as string;

    executeDelete({ id, boardId });
  };

  const onCopy = (formData: FormData) => {
    const id = formData.get('id') as string;
    const boardId = formData.get('boardId') as string;

    executeCopy({ id, boardId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className='h-auto w-auto p-2 hover:cursor-pointer'
          variant='ghost'
        >
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='px-0 pt-3 pb-3' side='bottom' align='start'>
        <div className='pb-4 text-center text-sm font-medium text-neutral-600 dark:text-neutral-200'>
          List Actions
        </div>
        <Button
          onClick={onAddCard}
          className='h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal hover:cursor-pointer'
          variant='ghost'
        >
          Add card...
        </Button>
        <form action={onCopy}>
          <input hidden name='id' id='id' defaultValue={data.id} />
          <input
            hidden
            name='boardId'
            id='boardId'
            defaultValue={data.boardId}
          />
          <FormSubmit
            className='h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal hover:cursor-pointer'
            variant='ghost'
          >
            Copy list...
          </FormSubmit>
        </form>
        <Separator />
        <form action={onDelete}>
          <input hidden name='id' id='id' defaultValue={data.id} />
          <input
            hidden
            name='boardId'
            id='boardId'
            defaultValue={data.boardId}
          />
          <FormSubmit
            className='text-destructive hover:text-destructive h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal hover:cursor-pointer dark:text-red-500 dark:hover:text-red-500'
            variant='ghost'
          >
            Delete this list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
