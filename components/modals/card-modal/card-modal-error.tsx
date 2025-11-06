'use client';

import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardModalErrorProps {
  onClose: () => void;
}

export const CardModalError = ({ onClose }: CardModalErrorProps) => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-8'>
      <div className='flex items-center gap-3 rounded-lg bg-destructive/10 px-4 py-3 w-full'>
        <AlertCircle className='h-5 w-5 flex-shrink-0 text-destructive' />
        <div className='flex-1 min-w-0'>
          <p className='font-medium text-destructive text-sm'>
            Failed to load card details
          </p>
          <p className='text-muted-foreground text-xs mt-1'>
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
