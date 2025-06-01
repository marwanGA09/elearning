import { db } from '@/lib/db';
import React from 'react';
import Categories from './_components/Categories';
import SearchInput from '@/components/SearchInput';

async function search() {
  const categories = await db.category.findMany({
    orderBy: {
      name: 'desc',
    },
  });
  console.log({ categories });

  return (
    <>
      <div className="block md:hidden mt-3 mx-4">
        <SearchInput />
      </div>
      <div className="p-4">
        <Categories categories={categories} />
      </div>
    </>
  );
}

export default search;
