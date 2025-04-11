'use client';

import { UserButton } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

function NavbarRoutes() {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacher = pathname.startsWith('/teacher');
  const isPlayerPage = pathname.includes('/chapter');
  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacher || isPlayerPage ? (
        <Link href={'/'}>
          <Button>
            <LogOut className="h-4 w-4 mr-2" /> Exit
          </Button>
        </Link>
      ) : (
        <Link href={'/teacher/course'}>
          <Button variant="ghost" size="sm">
            Teacher Mode
          </Button>
        </Link>
      )}
      <UserButton afterSwitchSessionUrl="/" />
    </div>
  );
}

export default NavbarRoutes;
