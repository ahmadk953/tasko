import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useRef } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FormPicker } from '@/components/form/form-picker';
import { FormSubmit } from '@/components/form/form-submit';
import { useAction } from '@/hooks/use-action';
import { updateBoard } from '@/actions/update-board';

interface BoardUpdateImageProps {
  boardId: string;
}

export const BoardUpdateImage = ({ boardId }: BoardUpdateImageProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  const { execute, fieldErrors } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast.success('Board image updated');
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const image = formData.get('image') as string;

    execute({ id: boardId, image });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          className='h-auto w-full justify-start p-2 px-5 text-sm font-normal text-neutral-600'
        >
          Change Background Image
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 pt-3' side='left' align='start'>
        <PopoverClose asChild>
          <Button
            className='absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600'
            variant='ghost'
          >
            <X className='h-4 w-4' />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className='space-y-4'>
          <div className='space-y-4'>
            <p className='text-center text-xs font-medium italic text-neutral-700'>
              Images Provided by{' '}
              <Link
                className='text-sky-900 underline'
                href='https://unsplash.com/'
              >
                Unsplash
              </Link>
            </p>
            <FormPicker id='image' errors={fieldErrors} />
          </div>
          <FormSubmit className='w-full'>Update</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
