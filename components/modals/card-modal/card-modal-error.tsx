'use client';

import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardModalErrorProps {
  onClose: () => void;
}

export const CardModalError = ({ onClose }: CardModalErrorProps) => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-8'>
      <div className='bg-destructive/10 flex w-full items-center gap-3 rounded-lg px-4 py-3'>
        <AlertCircle className='text-destructive h-5 w-5 flex-shrink-0' />
        <div className='min-w-0 flex-1'>
          <p className='text-destructive text-sm font-medium'>
            Failed to load card details
          </p>
          <p className='text-muted-foreground mt-1 text-xs'>
            Please try refreshing or closing and reopening this card.
          </p>
        </div>
      </div>
      <Button onClick={onClose} variant='outline' className='w-full'>
        <X className='mr-2 h-4 w-4' />
        Close
      </Button>
    </div>
  );
};
