import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

async function page({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    console.log({ course });
    if (!course) {
      return notFound();
    }
    // console.log({ course });
    const { userId } = await auth();
    if (!userId) {
      redirect('/sign-in');
    }
  } catch (error) {
    console.log('[COURSE_ID]', error);
    return notFound();
  }

  return (
    <div>
      <h1>course </h1>
      <p>{courseId}</p>
    </div>
  );
}

export default page;
