import * as React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold">
          Legal AI
        </Link>
      </div>
      <div className="flex items-center justify-end space-x-6">
        <Link href="/login" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Log In
        </Link>
        <Link href="/signup" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Header;