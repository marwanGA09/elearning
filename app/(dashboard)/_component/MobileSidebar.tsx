import { Menu } from 'lucide-react';
import { DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import Sidebar from './sidebar';

import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
function MobileSidebar() {
  return (
    <div>
      <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white">
          <VisuallyHidden>
            <DialogTitle>Sidebar Navigation</DialogTitle>
          </VisuallyHidden>
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileSidebar;
