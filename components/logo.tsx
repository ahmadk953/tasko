'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export const Logo = () => {
  const { theme } = useTheme();

  return (
    // TODO: Make this go back to the organization page if you are logged in
    <Link href='/'>
      <div
        className='hidden items-center gap-x-2 transition hover:opacity-75 md:flex'
        suppressHydrationWarning
      >
        <Image
          src={`/logo-${theme === 'light' ? 'light' : 'dark'}.svg`}
          alt='logo'
          height={100}
          width={100}
        />
      </div>
    </Link>
  );
};
