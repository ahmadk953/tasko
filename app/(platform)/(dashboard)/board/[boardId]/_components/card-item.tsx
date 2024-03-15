'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@prisma/client';
import { format } from 'date-fns';

import { useCardModal } from '@/hooks/use-card-modal';
import { Calendar } from 'lucide-react';

interface CardItemProps {
  index: number;
  data: Card;
}

export const CardItem = ({ index, data }: CardItemProps) => {
  const cardModal = useCardModal();

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role='button'
          onClick={() => cardModal.onOpen(data.id)}
          className='truncate rounded-md border-2 border-transparent bg-white px-3 py-2 text-sm shadow-sm hover:border-black'
        >
          {data.title}
          <div className='flex w-fit rounded-md border-2 border-transparent bg-slate-100 px-0.5 pb-0.5 pt-0.5 text-sm'>
            <Calendar className='ml-0.5 mr-0.5 h-4 w-4' />
            {data?.dueDate ? 'Due: ' + format(data.dueDate, 'PP') : 'No Due Date'}
          </div>
        </div>
      )}
    </Draggable>
  );
};
