import Link from 'next/link';
import React from 'react';
import { buttonVariants } from '@/components/ui/button';
import { HandMetal } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserAccountNav from './UserAccountNav';

async function NavBar() {
  const session = await getServerSession(authOptions);
  return (
    <div className="fixed top-0 z-10 w-full border-b border-s-slate-100 bg-slate-100 py-2">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <HandMetal />
        </Link>
        {session?.user ? (
          <UserAccountNav />
        ) : (
          <Link className={buttonVariants()} href="/sign-in">
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}

export default NavBar;
