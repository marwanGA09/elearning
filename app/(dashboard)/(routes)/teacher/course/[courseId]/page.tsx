import { IconBadge } from '@/components/IconBadge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { LayoutDashboard } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import TitleForm from './_component/TitleForm';
import { Description } from '@radix-ui/react-dialog';
import DescriptionForm from './_component/DescriptionForm';
import ImageForm from './_component/ImageForm';

async function page({ params }: { params: Promise<{ courseId: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const { courseId } = await params;
  const course = await db.course.findUnique({
    where: { id: courseId },
  });
  console.log({ course });
  if (!course) {
    return notFound();
  }

  const requiredField = [
    course.title,
    course.description,
    course.imageUrl,
    course.isPublished,
    course.price,
  ];

  // const completedField = requiredField.filter((field) => Boolean(field)).length;
  // THE ABOVE LINE IS EQUIVALENT TO THE LINE BELOW
  const completedField = requiredField.filter(Boolean).length;

  const courseCompletionText = `${completedField}/${requiredField.length} fields completed`;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium"> Course setup</h1>{' '}
          <span className="text-slate-700 text-sm">
            Completed field {courseCompletionText}
          </span>
        </div>
      </div>
      <div className="grid gap-6 mt-16 md:grid-cols-2">
        <div className="">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />{' '}
            <h2 className="text-xl">Customize you course</h2>
          </div>
          <TitleForm initialData={course} />
          <DescriptionForm initialData={course} />
          <ImageForm initialData={course} />
        </div>
      </div>
    </div>
  );
}

export default page;
