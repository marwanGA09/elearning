'use client';
import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import qs from 'query-string';
import {
  CogIcon,
  CameraIcon,
  DumbbellIcon,
  LandmarkIcon,
  ChevronsLeftRightEllipsisIcon,
  ComputerIcon,
  FilmIcon,
  LucideIcon,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { on } from 'events';

const iconMap = {
  Engineering: CogIcon,
  Photography: CameraIcon,
  Fitness: DumbbellIcon,
  Accounting: LandmarkIcon,
  'Web development': ChevronsLeftRightEllipsisIcon,
  'Computer science': ComputerIcon,
  Filming: FilmIcon,
};
interface CategoriesProps {
  categories: Category[];
}
function Categories({ categories }: CategoriesProps) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2 justify-between">
      {categories.map((category) => {
        const Icon = iconMap[category.name as keyof typeof iconMap];

        return (
          <CategoryItem
            key={category.id}
            value={category.id}
            name={category.name}
            Icon={Icon}
          />
        );
      })}
    </div>
  );
}

export default Categories;

function CategoryItem({
  name,
  Icon,
  value,
}: {
  value: string;
  name: string;
  Icon?: LucideIcon;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchparams = useSearchParams();
  const currenCategoryId = searchparams.get('categoryId');
  const currenTitle = searchparams.get('title');

  const isActive = currenCategoryId === value;
  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: isActive ? undefined : value,
          title: currenTitle || undefined,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        `flex  items-center gap-x-2 hover:border-sky-700 transition py-2 px-3 border-slate-300 border rounded-full`,
        isActive && 'bg-sky-200/20  text-sky-700'
      )}
    >
      {Icon && <Icon className="h-4 w-4 text-orange-400" />}
      <span className=" truncate hidden md:flex ">{name}</span>
    </button>
  );
}
