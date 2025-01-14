'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useProModal } from '@/hooks/use-pro-modal';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import { stripeRedirect } from '@/actions/stripe-redirect';

export const ProModal = () => {
  const proModal = useProModal();
  const router = useRouter();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      router.push(data);
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
        <VisuallyHidden.Root>
          <DialogTitle>Upgrade to Tasko Pro</DialogTitle>
        </VisuallyHidden.Root>
        <div className='relative flex aspect-video items-center justify-center'>
          <Image src='/hero.svg' alt='hero' className='object-cover' fill />
        </div>
        <div className='mx-auto space-y-6 p-6 text-neutral-700 dark:text-neutral-200'>
          <h1 className='text-xl font-semibold'>Upgrade to Tasko Pro Today!</h1>
          <p className='text-xs font-semibold text-neutral-600 dark:text-neutral-300'>
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
