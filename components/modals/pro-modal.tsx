'use client';

import Image from 'next/image';
import { toast } from 'sonner';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useProModal } from '@/hooks/use-pro-modal';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import { stripeRedirect } from '@/actions/stripe-redirect';

export const ProModal = () => {
  const proModal = useProModal();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onClick = () => {
    execute({});
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent className='max-w-md overflow-hidden p-0'>
        <div className='relative flex aspect-video items-center justify-center'>
          <Image src='/hero.svg' alt='hero' className='object-cover' fill />
        </div>
        <div className='mx-auto space-y-6 p-6 text-neutral-700'>
          <h1 className='text-xl font-semibold'>Upgrade to Tasko Pro Today!</h1>
          <p className='text-xs font-semibold text-neutral-600'>
            Explore the best of Tasko
          </p>
          <div className='pl-3'>
            <ul className='list-disc text-sm'>
              <li>Unlimited boards</li>
              <li className='italic'>Advanced Checklists (Coming Soon)</li>
              <li className='italic'>
                Admin and Security Features (Coming Soon)
              </li>
              <li className='italic'>And More to Come Soon!</li>
            </ul>
          </div>
          <Button
            disabled={isLoading}
            onClick={onClick}
            className='w-full'
            variant='primary'
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
