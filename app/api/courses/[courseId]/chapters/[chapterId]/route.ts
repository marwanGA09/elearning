import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { error } from 'console';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { chapterId, courseId } = await params;
    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId: `${userId}` },
    });
    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedDDDDD = await req.json();
    const { isPublished, ...updatedData } = updatedDDDDD;
    console.log('updated data', updatedDDDDD);
    console.log('updatedData', updatedData);
    const chapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: updatedData,
    });

    console.log({ chapter });

    return new NextResponse('Ok', { status: 201 });
  } catch (e) {
    console.log('ERROR_CHAPTER', e);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      courseId: string;
      chapterId: string;
    }>;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { chapterId, courseId } = await params;
    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId: `${userId}` },
    });
    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    if (!chapter) {
      return new NextResponse('not found', { status: 404 });
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
        courseId,
      },
    });

    const publishedChapterInTheCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!publishedChapterInTheCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log('[ERROR_ON_DELETE_CHAPTER]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
