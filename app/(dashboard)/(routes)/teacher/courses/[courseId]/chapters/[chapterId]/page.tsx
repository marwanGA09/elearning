import { IconBadge } from '@/components/IconBadge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import ChapterTitleForm from './_components/ChapterTitleForm';
import Tiptap from '@/components/Editor';
import ChapterDescriptionForm from './_components/ChapterDescriptionForm';
import PriceForm from './_components/PriceForm';
import VideoUrlForm from './_components/VideoUrlForm';
import Banner from '@/components/Banner';
import ChapterActions from './_components/ChapterActions';

async function chapterPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }
  const { courseId, chapterId } = await params;
  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return notFound();
  }

  const requiredField = [
    chapter?.title,
    chapter?.videoUrl,
    chapter?.description,
  ];

  const totalField = requiredField.length;
  const completedField = requiredField.filter(Boolean).length;
  const isComplete = requiredField.every(Boolean);

  const chapterCompletionText = `${completedField}/${totalField}`;
  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant={'warning'}
          label="This chapter un published. It will not visible to in the course"
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${chapter?.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all chapters {chapterCompletionText}
                </span>
              </div>
              <ChapterActions disabled={!isComplete} chapter={chapter} />
            </div>
          </div>
        </div>
        <div className="grid gap-6 mt-16 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your chapter</h2>
            </div>
            <ChapterTitleForm initialData={chapter} />
            <ChapterDescriptionForm initialData={chapter} />
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />{' '}
              <h2 className="text-xl">Customize Access</h2>
            </div>
            <PriceForm initialData={chapter} />
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a Video</h2>
            </div>
            <VideoUrlForm initialData={chapter} />
          </div>
        </div>
      </div>
    </>
  );
}

export default chapterPage;
