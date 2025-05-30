import { IconBadge } from '@/components/IconBadge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListCheck,
  ListChecks,
} from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import TitleForm from './_components/TitleForm';
import { Description } from '@radix-ui/react-dialog';
import DescriptionForm from './_components/DescriptionForm';
import ImageForm from './_components/ImageForm';
import CategoryForm from './_components/CatagoryForm';
import { Category } from '@prisma/client';
import PriceForm from './_components/PriceForm';
import AttachmentsForm from './_components/AttachmentForm';
import ChapterForm from './_components/ChapterForm';
import Banner from '@/components/Banner';
import CourseActions from './_components/CourseActions';

async function page({ params }: { params: Promise<{ courseId: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const { courseId } = await params;
  const course = await db.course.findUnique({
    where: { id: courseId, userId },
    include: {
      attachments: { orderBy: { createdAt: 'desc' } },
      chapters: { orderBy: { position: 'asc' } },
    },
  });

  const categories = await db.category.findMany({ orderBy: { name: 'asc' } });

  if (!course) {
    return notFound();
  }

  const requiredField = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId,
    course.price,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  // const completedField = requiredField.filter((field) => Boolean(field)).length;
  // THE ABOVE LINE IS EQUIVALENT TO THE LINE BELOW
  const completedField = requiredField.filter(Boolean).length;
  const courseCompletionText = `${completedField}/${requiredField.length} fields completed`;

  const isCompleted = requiredField.every(Boolean);
  return (
    <>
      {!course.isPublished && (
        <Banner
          variant={'warning'}
          label="This course is unpublished. It will not be visible to the students"
        />
      )}
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium"> Course setup</h1>{' '}
            <span className="text-slate-700 text-sm">
              Completed field {courseCompletionText}
            </span>
          </div>
          <CourseActions disabled={!isCompleted} course={course} />
        </div>
        <div className="grid gap-6 mt-16 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />{' '}
              <h2 className="text-xl">Customize you course</h2>
            </div>
            <TitleForm initialData={course} />
            <DescriptionForm initialData={course} />
            <ImageForm initialData={course} />
            <CategoryForm
              initialData={course}
              options={categories.map((category) => {
                return { value: category.id, label: category.name };
              })}
            />
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />{' '}
              <h2 className="text-xl">Course Chapters</h2>
            </div>
            <ChapterForm initialData={course} />
            <div className="space-y-6">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />{' '}
                <h2 className="text-xl">Sell your price</h2>
              </div>
              <PriceForm initialData={course} />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />{' '}
                <h2 className="text-xl">Resource And Attachments</h2>
              </div>
              <AttachmentsForm initialData={course} />
            </div>
          </div>
        </div>
      </div>{' '}
    </>
  );
}

export default page;
