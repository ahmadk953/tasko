import { Toaster } from 'sonner';
import { auth } from '@clerk/nextjs/server';
import { ClerkProvider } from '@clerk/nextjs';

import { ModalProvider } from '@/components/providers/modal-provider';
import { QueryProvider } from '@/components/providers/query-provider';

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  auth().protect();

  return (
    <ClerkProvider>
      <QueryProvider>
        <Toaster />
        <ModalProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
};

export default PlatformLayout;
