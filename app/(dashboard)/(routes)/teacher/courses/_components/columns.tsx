'use client';

import { formatPrice } from '@/lib/format';
import { Course } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';

import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconBadge } from '@/components/IconBadge';
import Banner from '@/components/Banner';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title: string = row.getValue('title');
      const isLong = title.length > 20;
      const displayText = isLong ? `${title.slice(0, 20)}...` : title;

      return isLong ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate block max-w-[500px] cursor-zoom-in">
                {displayText}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs break-words">
              <p className="py-1 px-3 bg-slate-700 text-slate-200 rounded-2xl  ">
                {title}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <span className="truncate block max-w-[500px]">{title}</span>
      );
    },
  },

  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));

      const formatted = price ? formatPrice(price) : '';
      console.log({ price, formatted });
      return <div className=" font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'isPublished',
    header: 'Published',
    cell: ({ row }) => {
      const isPublished = row.getValue('isPublished') || false;

      return (
        <div
          className={cn(
            'px-3 py-1 bg-slate-600 rounded-xl text-slate-300 w-min',
            isPublished && 'bg-sky-700'
          )}
        >
          {isPublished ? 'Published' : 'Draft'}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const course = row.original;

      return (
        <div className="text-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 ">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <Link href={`/teacher/courses/${course.id}`}>
                <DropdownMenuItem>
                  <Pencil className="w-4 h-4 ml-2" />
                  Edit
                </DropdownMenuItem>
              </Link>
              {/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
