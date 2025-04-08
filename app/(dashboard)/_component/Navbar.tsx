import React from 'react';
import MobileSidebar from './MobileSidebar';

function Navbar() {
  return (
    <div className="h-full p-4 border-b flex items-center bg-white  shadow-sm">
      <MobileSidebar />
    </div>
  );
}

export default Navbar;
