import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { courseId } = await params;

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: `${userId}`,
      },
      include: {
        chapters: true,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const hasPublishedChapter = courseOwner.chapters.some(
      (chapter) => chapter.isPublished
    );

    console.log({ hasPublishedChapter });

    if (
      hasPublishedChapter &&
      courseOwner.description &&
      courseOwner.categoryId &&
      courseOwner.price &&
      courseOwner.imageUrl
    ) {
      const updatedCourse = await db.course.update({
        where: {
          id: courseId,
          userId,
        },
        data: { isPublished: true },
      });
      return NextResponse.json(updatedCourse);
    }
    return new NextResponse('Course has some unfilled requirement', {
      status: 401,
    });
  } catch (e) {
    console.log('[ERROR]', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
