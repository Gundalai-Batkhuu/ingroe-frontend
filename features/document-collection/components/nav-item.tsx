'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

export function NavItem({
  href,
  label,
  children
}: NavItemProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={clsx(
        'flex h-9 items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 w-full',
        {
          'bg-accent text-black': pathname === href,
        }
      )}
    >
      <span className="flex items-center pl-2.5 gap-3">
        {children}
        <span className="ml-2 whitespace-nowrap">{label}</span>
      </span>
    </Link>
  );
}
