import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';

export const Navbar = async () => {
  const { userId } = await auth();

  const isSignedIn = !!userId;

  return (
    <nav className='fixed top-0 z-50 flex h-14 w-full items-center border-b bg-white px-4 shadow-xs dark:bg-black'>
      <div className='mx-auto flex w-full items-center justify-between md:max-w-(--breakpoint-2xl)'>
        <Logo />
        <div className='ml-0 flex w-full flex-auto items-center space-x-1 md:ml-6 md:block md:w-auto md:space-x-4'>
          <Button size='sm' variant='ghost' asChild>
            <Link href='/blog'>Blog</Link>
          </Button>
          <Button size='sm' variant='ghost' asChild>
            <Link href='https://docs.tasko.ahmadk953.org/'>Docs</Link>
          </Button>
        </div>
        <div className='flex items-center gap-x-2 md:gap-x-4'>
          <ModeToggle />
          {!isSignedIn ? (
            <div className='flex items-center gap-x-2 md:gap-x-4'>
              <Button size='sm' variant='outline' asChild>
                <Link href='/sign-in'>Login</Link>
              </Button>
              <Button size='sm' asChild>
                <Link href='/sign-up'>Get Tasko for Free</Link>
              </Button>
            </div>
          ) : (
            <Button size='sm' variant='outline' asChild>
              <Link href='/select-org'>Dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
