'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { updateCard } from '@/actions/update-card';
import { useAction } from '@/hooks/use-action';
import { CardWithList } from '@/types';

interface DatePickerProps {
  type: 'dueDate' | 'startedAtDate';
  variant?:
    | 'outline'
    | 'default'
    | 'gray'
    | 'destructive'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'primary'
    | 'transparent';
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'inline';
  placeholder?: string;
  afterSelectText?: string;
  boardId?: string;
  card?: CardWithList;
}

export function DatePicker({
  type,
  variant,
  className,
  size,
  placeholder,
  afterSelectText,
  boardId,
  card,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();

  const { execute, isLoading } = useAction(updateCard, {
    onSuccess: () => {
      toast.success('Date updated');
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  React.useEffect(() => {
    if (card?.dueDate && type === 'dueDate') {
      setDate(card.dueDate);
    }

    if (card?.startedAt && type === 'startedAtDate') {
      setDate(card.startedAt);
    }
  }, [card?.startedAt, card?.dueDate, type]);

  const onBlur = () => {
    if (!date || !boardId || !card) return;

    if (type === 'dueDate') {
      execute({
        id: card.id,
        boardId,
        dueDate: date,
      });
    }

    if (type === 'startedAtDate') {
      execute({
        id: card.id,
        boardId,
        startedAt: date,
      });
    }

    setDate(date);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant ?? 'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          size={size}
          disabled={isLoading}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? (
            afterSelectText + format(date, 'PP')
          ) : (
            <span>{placeholder ? placeholder : 'Pick a date'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' onBlur={onBlur}>
        <Calendar mode='single' selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}
