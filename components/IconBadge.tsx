import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

const backgroundVariant = cva('flex justify-center items-center rounded-full', {
  variants: {
    variant: {
      default: 'bg-sky-100 ',
      success: 'bg-emerald-100',
    },
    size: {
      default: 'p-2',
      sm: 'p-1',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const iconVariant = cva('', {
  variants: {
    variant: {
      default: 'text-sky-700',
      success: 'text-emerald-700',
    },
    size: {
      default: 'h-8 w-8',
      sm: 'h-4 w-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type backgroundVariantProps = VariantProps<typeof backgroundVariant>;
type iconVariantProps = VariantProps<typeof iconVariant>;

interface IconBadgeProps extends backgroundVariantProps, iconVariantProps {
  icon: LucideIcon;
}

export const IconBadge = ({ icon: Icon, variant, size }: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariant({ variant, size }))}>
      <Icon className={cn(iconVariant({ variant, size }))} />
    </div>
  );
};
