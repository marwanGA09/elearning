import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Chapter } from '@prisma/client';
import { error } from 'console';
import { NextResponse } from 'next/server';
import { useId } from 'react';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { courseId } = await params;
    console.log({ courseId });

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId: `${userId}` },
    });
    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title } = await req.json();

    const lastChapter = await db.chapter.findFirst({
      where: { courseId },
      orderBy: { position: 'desc' },
    });
    console.log({ lastChapter });

    const lastPosition = Number(lastChapter?.position) + 1 || 0;
    console.log({ lastPosition });
    const chapter = await db.chapter.create({
      data: {
        title,
        courseId,
        position: lastPosition,
      },
    });
    return new NextResponse('Created New chapter', { status: 201 });
  } catch (e) {
    console.log('ERROR_CHAPTER', error);
    return new NextResponse('Internal server Error', { status: 201 });
  }
}

export async function PUT(
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

    const newChapters = await req.json(); // [{ id, order }, ...]

    const updates = await Promise.all(
      newChapters.map((chapter: Chapter, index: number) =>
        db.chapter.update({
          where: { id: chapter.id, courseId },
          data: { ...chapter, position: index },
        })
      )
    );
    return new NextResponse('Successful', { status: 201 });
  } catch (e) {
    console.error('ERROR_DROPPABLE', e);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
