import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CheckCircle, Icon } from 'lucide-react';

const bannerVariant = cva(
  'border text-center p-4 text-sm flex items-center w-full',
  {
    variants: {
      variant: {
        warning: 'bg-yellow-200/80 border-yellow-30 text-primary',
        success: 'bg-emerald-700 border-emerald-800 text-secondry',
      },
    },
    defaultVariants: { variant: 'warning' },
  }
);

interface BannerProps extends VariantProps<typeof bannerVariant> {
  label: string;
}

const IconMap = { warning: AlertTriangle, success: CheckCircle };

function Banner({ label, variant }: BannerProps) {
  const Icon = IconMap[variant || 'warning'];
  return (
    <div className={cn(bannerVariant({ variant }))}>
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </div>
  );
}

export default Banner;
