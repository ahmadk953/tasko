'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Activity, CreditCard, Layout, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export type Organization = {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
};

interface NavItemsProps {
  isExpanded: boolean;
  isActive: boolean;
  organization: Organization;
  onExpand: (id: string) => void;
}

export const NavItem = ({
  isExpanded,
  isActive,
  organization,
  onExpand,
}: NavItemsProps) => {
  const pathname = usePathname();

  const routes = [
    {
      label: 'Boards',
      icon: <Layout className='mr-2 h-4 w-4' />,
      href: `/organization/${organization.id}`,
    },
    {
      label: 'Activity',
      icon: <Activity className='mr-2 h-4 w-4' />,
      href: `/organization/${organization.id}/activity`,
    },
    {
      label: 'Settings',
      icon: <Settings className='mr-2 h-4 w-4' />,
      href: `/organization/${organization.id}/settings`,
    },
    {
      label: 'Billing',
      icon: <CreditCard className='mr-2 h-4 w-4' />,
      href: `/organization/${organization.id}/billing`,
    },
  ];

  return (
    <AccordionItem value={organization.id} className='border-none'>
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          'flex items-center gap-x-2 rounded-md p-1.5 text-start text-neutral-700 no-underline transition hover:cursor-pointer hover:bg-neutral-500/10 hover:no-underline dark:text-neutral-200 dark:hover:bg-neutral-200/10',
          isActive &&
            !isExpanded &&
            'bg-sky-500/10 text-sky-700 dark:bg-sky-300/10 dark:text-sky-600'
        )}
      >
        <div className='flex items-center gap-x-2'>
          <div className='relative h-7 w-7'>
            <Image
              fill
              src={organization.imageUrl}
              alt={organization.name}
              className='rounded-sm object-cover'
            />
          </div>
          <span className='text-sm font-medium'>{organization.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className='pt-1 text-neutral-700 dark:text-neutral-200'>
        {routes.map((route) => (
          <Button
            key={route.href}
            size='sm'
            className={cn(
              'mb-1 w-full justify-start pl-10 font-normal hover:cursor-pointer',
              pathname === route.href &&
                'bg-sky-500/10 text-sky-700 dark:bg-sky-300/10 dark:text-sky-600'
            )}
            variant='ghost'
            asChild
          >
            <Link href={route.href} className='flex items-center'>
              {route.icon}
              {route.label}
            </Link>
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

NavItem.Skeleton = function SkeletonNavItem() {
  return (
    <div className='flex items-center gap-x-2'>
      <div className='relative h-10 w-10 shrink-0'>
        <Skeleton className='absolute h-full w-full' />
      </div>
      <Skeleton className='h-4 w-full' />
    </div>
  );
};
