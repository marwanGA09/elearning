import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { useId } from 'react';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  console.log('here i am');
  try {
    const { userId } = await auth();
    console.log('userId from api post', userId);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { courseId } = await params;

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    console.log('userId', userId);

    const { url } = await req.json();
    console.log('url from api', url);

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    console.log({ courseOwner });
    const attachment = await db.attachment.create({
      data: { url: url.ufsUrl, name: url.name, courseId: courseId },
    });
    return NextResponse.json(attachment);
  } catch (error) {
    console.log('ERROR_ATTACHMENT', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
