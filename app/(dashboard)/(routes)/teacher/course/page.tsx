import { IconBadge } from '@/components/IconBadge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

function coursePage() {
  return (
    <div>
      <Link href={'/teacher/create'}>
        <Button className="p-6">Add course</Button>
      </Link>
    </div>
  );
}

export default coursePage;
