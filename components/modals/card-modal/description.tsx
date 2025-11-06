'use client';

import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useRef, useCallback, memo } from 'react';
import { useParams } from 'next/navigation';
import { AlignLeft } from 'lucide-react';
import { toast } from 'sonner';

import { FormTextarea } from '@/components/form/form-textarea';
import { FormSubmit } from '@/components/form/form-submit';
import { Skeleton } from '@/components/ui/skeleton';
import { updateCard } from '@/actions/update-card';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';

import { CardWithList } from '@/types';

interface DescriptionProps {
  data: CardWithList;
}

const DescriptionComponent = ({ data }: DescriptionProps) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(document.createElement('form'));

  const enableEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  }, []);

  const disableEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        disableEditing();
      }
    },
    [disableEditing]
  );

  useEventListener('keydown', onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['card', data.id] });
      queryClient.invalidateQueries({ queryKey: ['card-logs', data.id] });
      toast.success(`Card "${data.title}" updated`);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = useCallback(
    (formData: FormData) => {
      const description = formData.get('description') as string;
      const boardId = params.boardId as string;

      execute({
        id: data.id,
        description,
        boardId,
      });
    },
    [data.id, params.boardId, execute]
  );

  return (
    <div className='flex w-full items-start gap-x-4'>
      <AlignLeft className='mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-700 dark:text-neutral-100' />
      <div className='min-w-0 flex-1'>
        <p className='mb-3 text-lg font-semibold text-neutral-700 dark:text-neutral-100'>
          Description
        </p>
        {isEditing ? (
          <form ref={formRef} className='space-y-3' action={onSubmit}>
            <FormTextarea
              id='description'
              ref={textareaRef}
              className='mt-2 min-h-[150px] w-full resize-none'
              placeholder='Add a more detailed description...'
              defaultValue={data.description ?? undefined}
              errors={fieldErrors}
            />
            <div className='flex items-center gap-x-2'>
              <FormSubmit className='hover:cursor-pointer'>Save</FormSubmit>
              <Button
                type='button'
                onClick={disableEditing}
                size='sm'
                className='hover:cursor-pointer'
                variant='ghost'
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role='button'
            className='min-h-[100px] cursor-pointer rounded-md bg-neutral-200 px-4 py-3 text-sm transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700'
          >
            {data.description ?? 'Add a more detailed description...'}
          </div>
        )}
      </div>
    </div>
  );
};

const DescriptionMemo = memo(DescriptionComponent);

export const Description = Object.assign(DescriptionMemo, {
  Skeleton: function DescriptionSkeleton() {
    return (
      <div className='flex w-full items-start gap-x-3'>
        <Skeleton className='h-6 w-6 bg-neutral-200' />
        <div className='w-full'>
          <Skeleton className='mb-2 h-6 w-24 bg-neutral-200' />
          <Skeleton className='h-[78px] w-full bg-neutral-200' />
        </div>
      </div>
    );
  },
});
