import { auth } from '@clerk/nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new UploadThingError('Unauthorized');
  }
  return { userId };
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {}),
  courseAttachment: f(['image', 'video', 'audio', 'pdf', 'text'])
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {}),
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: '512MB' } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
