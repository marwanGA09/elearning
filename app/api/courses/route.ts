import { db } from '@/lib/db';
import { auth, getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    console.log({ req });
    if (!userId) {
      return new NextResponse('UNAUTHORIZED', { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSES]', error);
    return new NextResponse('INTERNAL ERROR', { status: 500 });
  }
}
