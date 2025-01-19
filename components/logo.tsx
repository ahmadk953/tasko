'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export const Logo = () => {
  const { resolvedTheme } = useTheme();

  return (
    // TODO: Make this go back to the organization page if you are logged in
    <Link href='/' suppressHydrationWarning>
      <div className='hidden items-center gap-x-2 transition hover:opacity-75 md:flex'>
        <Image
          src={`/logo-${resolvedTheme === 'dark' ? 'dark' : 'light'}.svg`}
          alt='logo'
          height={100}
          width={100}
        />
      </div>
    </Link>
  );
};
