import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Params } from 'next/dist/server/request/params';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
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

    const value = await req.json();
    // console.log('value from patch route', { value });
    // console.log({ courseId });
    // console.log(typeof courseId);

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: { ...value },
    });

    return new NextResponse('ok', { status: 200 });
  } catch (e) {
    console.log('[ERROR]', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      courseId: string;
    }>;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { courseId } = await params;
    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const deletedCourse = await db.course.delete({
      where: { id: courseId, userId },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log('[ERROR_ON_DELETE_COURSE]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
