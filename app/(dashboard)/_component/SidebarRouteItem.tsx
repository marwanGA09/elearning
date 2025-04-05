import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarRouteItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

function SidebarRouteItem({ icon: Icon, label, href }: SidebarRouteItemProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === '/' && href === '/') ||
    pathname === href ||
    pathname.startsWith(`${href}/`);

  return <div>SidebarRouteItem</div>;
}

export default SidebarRouteItem;
