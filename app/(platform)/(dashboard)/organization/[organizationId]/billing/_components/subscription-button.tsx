'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { stripeRedirect } from '@/actions/stripe-redirect';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import { useProModal } from '@/hooks/use-pro-modal';

interface SubscriptionButtonProps {
  isPro: boolean;
}

export const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
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
    if (isPro) {
      execute({});
    } else {
      proModal.onOpen();
    }
  };

  return (
    <Button disabled={isLoading} onClick={onClick} variant='primary'>
      {isPro ? 'Manage Subscription' : 'Upgrade to Pro'}
    </Button>
  );
};
