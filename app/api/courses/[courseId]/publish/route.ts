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
    });
    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: { isPublished: true },
    });

    return NextResponse.json(updatedCourse);
  } catch (e) {
    console.log('[ERROR]', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
