import { db } from '@/lib/db';
import React from 'react';
import Categories from './_components/Categories';

async function search() {
  const categories = await db.category.findMany({
    orderBy: {
      name: 'desc',
    },
  });
  console.log({ categories });

  return (
    <div>
      <Categories categories={categories} />
    </div>
  );
}

export default search;
