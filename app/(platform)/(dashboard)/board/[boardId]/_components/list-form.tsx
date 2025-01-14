'use client';

import { Plus, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { FormInput } from '@/components/form/form-input';
import { FormSubmit } from '@/components/form/form-submit';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import { createList } from '@/actions/create-list';

import { ListWrapper } from './list-wrapper';

export const ListForm = () => {
  const router = useRouter();
  const params = useParams();

  const formRef = useRef<HTMLFormElement>(document.createElement('form'));
  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" created!`);
      disableEditing();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      disableEditing();
    }
  };

  useEventListener('keydown', onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    const boardId = formData.get('boardId') as string;

    execute({ title, boardId });
  };

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          action={onSubmit}
          ref={formRef}
          className='w-full space-y-4 rounded-md bg-white p-3 shadow-md dark:bg-black'
        >
          <FormInput
            ref={inputRef}
            errors={fieldErrors}
            id='title'
            className='h-7 border-transparent px-2 py-1 text-sm font-medium transition hover:border-input focus:border-input'
            placeholder='Enter list title...'
          />
          <input hidden value={params.boardId} name='boardId' />
          <div className='flex items-center gap-x-1'>
            <FormSubmit>Add list</FormSubmit>
            <Button onClick={disableEditing} size='sm' variant='ghost'>
              <X className='h-5 w-5' />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className='flex w-full items-center rounded-md bg-white/80 p-3 text-sm font-medium transition hover:bg-white/50 dark:bg-white/10 dark:hover:bg-white/5'
      >
        <Plus className='mr-2 h-4 w-4' />
        Add a list
      </button>
    </ListWrapper>
  );
};
