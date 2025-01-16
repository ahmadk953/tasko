'use client';

import { Toaster } from 'sonner';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

import { ModalProvider } from '@/components/providers/modal-provider';
import { QueryProvider } from '@/components/providers/query-provider';

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      afterSignOutUrl='/'
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
      }}
    >
      <QueryProvider>
        <Toaster theme={resolvedTheme === 'dark' ? 'dark' : 'light'} />
        <ModalProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
};

export default PlatformLayout;
