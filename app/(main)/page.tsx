import { Medal } from 'lucide-react';
import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const headingFont = localFont({ src: '../../public/fonts/font.woff2' });

const textFont = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const MarketingPage = () => {
  return (
    <div className='flex flex-col items-center justify-center pt-20'>
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          headingFont.className
        )}
      >
        <div className='mb-4 flex items-center rounded-full border bg-amber-100 p-4 uppercase text-amber-700 shadow-sm'>
          <Medal className='mr-2 h-6 w-6' />
          No 1 task management app
        </div>
        <h1 className='mb-6 text-center text-neutral-800 ~/md:~text-3xl/6xl dark:text-neutral-100'>
          Tasko helps teams move
        </h1>
        <div className='w-fit rounded-md bg-gradient-to-r from-fuchsia-600 to-pink-600 p-2 px-4 pb-4 text-white ~/md:~text-3xl/6xl'>
          Work forward
        </div>
      </div>
      <div
        className={cn(
          'mx-auto mt-4 text-center text-neutral-400 ~/md:~text-sm/xl ~/md:~max-w-xs/2xl',
          textFont.className
        )}
      >
        Collaborate, manage projects, and reach new productivity peaks. From
        high rises to the home office, the way your team works is unique -
        accomplish it all with Tasko.
      </div>
      <Button className='mt-6' size='lg' asChild>
        <Link href='/sign-up'>Get Tasko for free</Link>
      </Button>
    </div>
  );
};

export default MarketingPage;
