'use client';

import { Compass, Layout } from 'lucide-react';
import SidebarRouteItem from './SidebarRouteItem';
const guestRoutes = [
  {
    icon: Layout,
    label: 'Dashboard',
    ref: '/',
  },
  {
    icon: Compass,
    label: 'Browse',
    ref: '/search',
  },
];

function SidebarRoute() {
  const routes = guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarRouteItem
          key={route.ref}
          icon={route.icon}
          label={route.label}
          href={route.ref}
        />
      ))}
    </div>
  );
}

export default SidebarRoute;
