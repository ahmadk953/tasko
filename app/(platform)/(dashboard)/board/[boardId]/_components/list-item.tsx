'use client';

import { useRef, useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';

import { ListWithCards } from '@/types';
import { cn } from '@/lib/utils';

import { ListHeader } from './list-header';
import { CardForm } from './card-form';
import { CardItem } from './card-item';

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

export const ListItem = ({ index, data }: ListItemProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className='h-full w-[272px] shrink-0 select-none'
        >
          <div
            {...provided.dragHandleProps}
            className='w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md dark:bg-[#1f1f1f]'
          >
            <ListHeader onAddCard={enableEditing} data={data} />
            <Droppable droppableId={data.id} type='card'>
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'mx-1 flex flex-col gap-y-2 px-1 py-0.5',
                    data.cards.length > 0 ? 'mt-2' : 'mt-0'
                  )}
                >
                  {data.cards.map((card, index) => (
                    <CardItem index={index} key={card.id} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              listId={data.id}
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};
