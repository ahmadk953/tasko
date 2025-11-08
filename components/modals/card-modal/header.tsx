'use client';

import { useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Layout } from 'lucide-react';
import { toast } from 'sonner';
import { memo } from 'react';

import { CardWithList } from '@/types';
import { useAction } from '@/hooks/use-action';
import { updateCard } from '@/actions/update-card';
import { FormInput } from '@/components/form/form-input';
import { Skeleton } from '@/components/ui/skeleton';

interface HeaderProps {
  data: CardWithList;
}

const HeaderComponent = ({ data }: HeaderProps) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(data?.title || '');

  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['card', data.id],
      });

      queryClient.invalidateQueries({
        queryKey: ['card-logs', data.id],
      });

      toast.success(`Card renamed to "${data.title}"`);
      setTitle(data.title);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onBlur = useCallback(() => {
    inputRef.current?.form?.requestSubmit();
  }, []);

  const onSubmit = useCallback(
    (formData: FormData) => {
      const newTitle = formData.get('title') as string;
      const boardId = params.boardId as string;

      if (newTitle === data.title) return;

      execute({
        id: data.id,
        title: newTitle,
        boardId,
      });
    },
    [data.title, data.id, params.boardId, execute]
  );

  return (
    <div className='mb-8 flex w-full items-start gap-x-4 border-b pb-6'>
      <Layout className='mt-1 h-6 w-6 flex-shrink-0 text-neutral-700 dark:text-neutral-100' />
      <div className='max-w-max min-w-0 flex-1'>
        <form action={onSubmit}>
          <FormInput
            id='title'
            ref={inputRef}
            onBlur={onBlur}
            defaultValue={title}
            className='font-semi-bold focus-visible:border-input relative -left-1 mb-0.5 w-full truncate border-transparent bg-transparent px-1 text-2xl font-bold text-neutral-700 focus-visible:bg-white dark:text-neutral-100 dark:focus-visible:bg-black'
          />
        </form>
        <p className='text-muted-foreground text-sm'>
          in list <span className='underline'>{data.list.title}</span>
        </p>
      </div>
    </div>
  );
};

const HeaderMemo = memo(HeaderComponent);

export const Header = Object.assign(HeaderMemo, {
  Skeleton: function HeaderSkeleton() {
    return (
      <div className='mb-6 flex items-start gap-x-3'>
        <Skeleton className='mt-1 h-6 w-6 bg-neutral-200' />
        <div>
          <Skeleton className='mb-1 h-6 w-24 bg-neutral-200' />
          <Skeleton className='h-4 w-12 bg-neutral-200' />
        </div>
      </div>
    );
  },
});
