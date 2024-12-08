import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export const Navbar = async () => {
  const { userId } = await auth();

  let isSignedIn = !!userId;

  return (
    <div className='fixed top-0 flex h-14 w-full items-center border-b bg-white px-4 shadow-sm'>
      <div className='mx-auto flex w-full items-center justify-between md:max-w-screen-2xl'>
        <Logo />
        <div className='ml-0 flex w-full flex-auto items-center space-x-1 md:ml-6 md:block md:w-auto md:space-x-4'>
          <Button size='sm' variant='ghost' asChild>
            <Link href='/blog'>Blog</Link>
          </Button>
          <Button size='sm' variant='ghost' asChild>
            <Link href='https://docs.tasko.ahmadk953.org/'>Docs</Link>
          </Button>
        </div>
        <div className='flex w-full items-center justify-between space-x-4 md:block md:w-auto'>
          {!isSignedIn ? (
            <div className='flex w-full justify-between space-x-4 md:block md:w-auto'>
              <Button size='sm' variant='outline' asChild>
                <Link href='/sign-in'>Login</Link>
              </Button>
              <Button size='sm' asChild>
                <Link href='/sign-up'>Get Tasko for Free</Link>
              </Button>
            </div>
          ) : (
            <div>
              <Button size='sm' variant='outline' asChild>
                <Link href='/select-org'>Dashboard</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
