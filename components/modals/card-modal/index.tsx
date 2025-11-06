'use client';

import { useMemo } from 'react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

import { useCardModal } from '@/hooks/use-card-modal';
import { useCardData } from '@/hooks/use-card-data';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { Header } from './header';
import { Description } from './description';
import { Actions } from './actions';
import { Activity } from './activity';
import { CardModalError } from './card-modal-error';

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const { cardData, auditLogs, isError } = useCardData(id);

  // Memoize loading states to prevent unnecessary re-renders
  const isCardLoaded = useMemo(() => !!cardData?.title, [cardData?.title]);
  const isAuditLogsLoaded = useMemo(() => !!auditLogs, [auditLogs]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto w-full max-w-2xl sm:max-w-4xl lg:max-w-5xl'>
        <VisuallyHidden.Root>
          <DialogTitle>Card Data Panel</DialogTitle>
        </VisuallyHidden.Root>

        {isError ? (
          <CardModalError onClose={onClose} />
        ) : (
          <>
            {isCardLoaded && cardData ? (
              <Header data={cardData} />
            ) : (
              <Header.Skeleton />
            )}

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2'>
                <div className='w-full space-y-8'>
                  {isCardLoaded && cardData ? (
                    <Description data={cardData} />
                  ) : (
                    <Description.Skeleton />
                  )}
                  {isAuditLogsLoaded && auditLogs ? (
                    <Activity items={auditLogs} />
                  ) : (
                    <Activity.Skeleton />
                  )}
                </div>
              </div>
              <div>
                {isCardLoaded && cardData ? (
                  <Actions data={cardData} />
                ) : (
                  <Actions.Skeleton />
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
