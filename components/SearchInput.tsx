'use client';
import { SearchIcon } from 'lucide-react';
import React from 'react';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import qs from 'query-string';

function SearchInput() {
  const pathname = usePathname();
  const router = useRouter();
  const searchparams = useSearchParams();

  const onInput = useDebouncedCallback((title) => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title,
          categoryId: searchparams.get('categoryId') || undefined,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  }, 500);
  return (
    <div className="relative w-full md:w-[350px]">
      <SearchIcon className="absolute top-3 left-3 h-4 w-4 text-slate500 rounded-full" />
      <Input
        className="pl-9"
        placeholder="Search for course"
        onChange={(e) => {
          onInput(e.target.value);
        }}
      />{' '}
    </div>
  );
}

export default SearchInput;
