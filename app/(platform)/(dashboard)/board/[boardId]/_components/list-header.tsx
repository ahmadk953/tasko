'use client';

import { useState, useRef, useEffect } from 'react';
import { useEventListener } from 'usehooks-ts';
import { List } from '@/generated/prisma/client';
import { toast } from 'sonner';

import { FormInput } from '@/components/form/form-input';
import { useAction } from '@/hooks/use-action';
import { updateList } from '@/actions/update-list';

import { ListOptions } from './list-options';

interface ListHeaderProps {
  data: List;
  onAddCard: () => void;
}

export const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    formRef.current = document.createElement('form');
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const { execute } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    const id = formData.get('id') as string;
    const boardId = formData.get('boardId') as string;

    if (title === data.title) return disableEditing();

    execute({ title, id, boardId });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      formRef.current?.requestSubmit();
    }
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  useEventListener('keydown', onKeyDown);

  return (
    <div className='flex items-start justify-between gap-x-2 px-2 pt-2 text-sm font-semibold'>
      {isEditing ? (
        <form ref={formRef} action={onSubmit} className='flex-1 px-[2px]'>
          <input hidden id='id' name='id' defaultValue={data.id} />
          <input
            hidden
            id='boardId'
            name='boardId'
            defaultValue={data.boardId}
          />
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id='title'
            placeholder='Enter list title...'
            defaultValue={title}
            className='hover:border-input focus:border-input h-7 truncate border-transparent bg-transparent px-[7px] py-1 text-sm font-medium transition focus:bg-white dark:focus:bg-black'
          />
          <button hidden type='submit' />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className='h-7 w-full border-transparent px-2.5 py-1 text-sm font-medium hover:cursor-text'
        >
          {title}
        </div>
      )}
      <ListOptions onAddCard={onAddCard} data={data} />
    </div>
  );
};
