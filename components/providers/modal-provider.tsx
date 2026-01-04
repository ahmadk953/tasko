'use client';

import { CardModal } from '@/components/modals/card-modal';
import { ProModal } from '@/components/modals/pro-modal';

export const ModalProvider = () => {
  return (
    <>
      <CardModal />
      <ProModal />
    </>
  );
};
