'use client';

import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Layout } from 'lucide-react';
import { toast } from 'sonner';

import { CardWithList } from '@/types';
import { useAction } from '@/hooks/use-action';
import { updateCard } from '@/actions/update-card';
import { FormInput } from '@/components/form/form-input';
import { Skeleton } from '@/components/ui/skeleton';

interface HeaderProps {
  data: CardWithList;
}

export const Header = ({ data }: HeaderProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

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

  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(data.title);

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    const boardId = params.boardId as string;

    if (title === data.title) return;

    execute({
      id: data.id,
      title,
      boardId,
    });
  };

  return (
    <div className='mb-6 flex w-full items-start gap-x-3'>
      <Layout className='mt-1 h-5 w-5 text-neutral-700' />
      <div className='w-full'>
        <form action={onSubmit}>
          <FormInput
            id='title'
            ref={inputRef}
            onBlur={onBlur}
            defaultValue={title}
            className='font-semi-bold relative -left-1 mb-0.5 w-[95%] truncate border-transparent bg-transparent px-1 text-xl text-neutral-700 focus-visible:border-input focus-visible:bg-white'
          />
        </form>
        <p className='text-sm text-muted-foreground'>
          in list <span className='underline'>{data.list.title}</span>
        </p>
      </div>
    </div>
  );
};

Header.Skeleton = function HeaderSkelton() {
  return (
    <div className='mb-6 flex items-start gap-x-3'>
      <Skeleton className='mt-1 h-6 w-6 bg-neutral-200' />
      <div>
        <Skeleton className='mb-1 h-6 w-24 bg-neutral-200' />
        <Skeleton className='h-4 w-12 bg-neutral-200' />
      </div>
    </div>
  );
};
