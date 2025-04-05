import React from 'react';
import Logo from './Logo';
import SidebarRoute from './SidebarRoute';

function Sidebar() {
  return (
    <div className="h-full flex overflow-auto border-r flex-col bg-white shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoute />
      </div>
    </div>
  );
}

export default Sidebar;
