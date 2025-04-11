import React from 'react';
import MobileSidebar from './MobileSidebar';
import NavbarRoutes from '@/components/NavbarRoutes';

function Navbar() {
  return (
    <div className="h-full p-4 border-b flex items-center bg-white  shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
}

export default Navbar;
