'use client';
import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
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
          <CategoryItem key={category.id} name={category.name} Icon={Icon} />
        );
      })}
    </div>
  );
}

export default Categories;

function CategoryItem({ name, Icon }: { name: string; Icon?: LucideIcon }) {
  return (
    <button
      className={cn(
        `flex  items-center gap-x-2 hover:border-sky-700 transition py-2 px-3 border-slate-300 rounded-full`
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span className=" truncate hidden md:flex ">{name}</span>
    </button>
  );
}
