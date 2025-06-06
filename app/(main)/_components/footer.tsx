import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export const Footer = () => {
  return (
    <div className='fixed bottom-0 w-full border-t bg-slate-100 p-4 dark:bg-slate-800'>
      <div className='mx-auto flex w-full items-center justify-between md:max-w-screen-2xl'>
        <Logo />
        <div className='flex w-full items-center justify-between space-x-4 md:block md:w-auto'>
          <Button className='italic' size='sm' variant='ghost'>
            Privacy Policy - Temporarily Removed
          </Button>
          <Button className='italic' size='sm' variant='ghost'>
            Terms of Service - Coming Soon
          </Button>
        </div>
      </div>
    </div>
  );
};
