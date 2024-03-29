import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  return (
    // TODO: Make this go back to teh organization page is you are logged in
    <Link href='/'>
      <div className='hidden items-center gap-x-2 transition hover:opacity-75 md:flex'>
        <Image
          src='/logo-transparent.svg'
          alt='logo'
          height={100}
          width={100}
        />
      </div>
    </Link>
  );
};
