import { cn } from '@/lib/utils';
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

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        'flex items-center gap-x-2 text-slate-500 text-sm-font[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 h-full',
        isActive &&
          'bg-sky-300/20  hover:bg-sky-300/20 text-sky-700 hover:text-sky-700  '
      )}
    >
      <div className="flex items-center gap-x-2 py-4 h-full">
        <Icon
          size={22}
          className={cn('text-slate-500', isActive && 'text-slate-700')}
        />
        {label}
      </div>
      <div
        className={cn(
          'ml-auto opacity-0 border-2  border-sky-700 h-full transition-all',
          isActive && 'opacity-100'
        )}
      />
    </button>
  );
}

export default SidebarRouteItem;
