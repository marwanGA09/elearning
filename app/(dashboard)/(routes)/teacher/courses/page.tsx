import { columns } from './_components/columns';
import { DataTable } from './_components/dataTable';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function coursePage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }
  const data = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
