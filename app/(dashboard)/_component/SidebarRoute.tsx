'use client';

import { BarChart, Compass, Layout, List } from 'lucide-react';
import SidebarRouteItem from './SidebarRouteItem';
import { use } from 'react';
import { usePathname } from 'next/navigation';
import { Istok_Web } from 'next/font/google';

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

const teacherRoute = [
  {
    icon: List,
    label: 'Course',
    ref: '/teacher/course',
  },
  {
    icon: BarChart,
    label: 'Analytics',
    ref: '/teacher/analytics',
  },
];

function SidebarRoute() {
  const pathname = usePathname();

  const isTeacher = pathname.includes('/teacher');

  const routes = isTeacher ? teacherRoute : guestRoutes;
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
