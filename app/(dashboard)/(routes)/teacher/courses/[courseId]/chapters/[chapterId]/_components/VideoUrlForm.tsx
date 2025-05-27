'use client';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ImageIcon, Pencil, PlusCircleIcon, VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Chapter, Course, MuxData } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/FileUplaod';
interface VideoUrlFormProps {
  initialData: Chapter & {
    muxData?: MuxData | null;
  };
}

const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: 'Image url is required',
  }),
});

function VideoUrlForm({ initialData }: VideoUrlFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => {
    setIsEditing((edit) => !edit);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { videoUrl: initialData.videoUrl || '' },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      console.log('value from onsubmit ', { value });
      const res = await axios.patch(
        `/api/courses/${initialData.courseId}/chapters/${initialData.id}`,
        value
      );

      console.log({ res });
      toggleEdit();
      toast.success('Course updated successfully');
      router.refresh();
    } catch (e) {
      toast.error('Something went wrong');
      console.log(e);
    }
  };

  return (
    <div className="mt-6 rounded-md bg-slate-100 border p-4">
      <div className="flex justify-between items-center font-medium">
        Chapter Video
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing ? (
            <>Cancel</>
          ) : initialData.videoUrl ? (
            <>
              <Pencil /> Edit Image
            </>
          ) : (
            <>
              {' '}
              <PlusCircleIcon /> Add Image
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            {/* <video src="https://k1npyxutp4.ufs.sh/f/Cye1FZPh2ctrc5agTA7eYwnH6DUA8JhXNtLyZbG9pWzRToei" /> */}
            {/* <Video
              controls
              className="w-full h-full rounded-md object-cover"
              src={
                'https://k1npyxutp4.ufs.sh/f/Cye1FZPh2ctrc5agTA7eYwnH6DUA8JhXNtLyZbG9pWzRToei'
              }
            ></Video> */}

            <video
              controls
              autoPlay
              loop
              muted
              className="w-full rounded-lg shadow-lg"
            >
              <source
                src={initialData.videoUrl}
                // type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        )
      ) : (
        <div className="">
          <FileUpload
            endPoint="chapterVideo"
            onChange={(ufsUrl) => {
              console.log({ ufsUrl });
              if (ufsUrl) {
                onSubmit({ videoUrl: ufsUrl.ufsUrl });
              }
            }}
          />
          <div className="text-sm mt-2 text-muted-foreground">
            {' '}
            Upload a video for this chapter.{' '}
          </div>{' '}
        </div>
      )}

      {initialData.videoUrl && !isEditing && (
        <div className="text-muted-foreground text-sm mt-2">
          Video can take few minute to process, Refresh the page if the video
          doesn&apos;t appear
        </div>
      )}
    </div>
  );
}

export default VideoUrlForm;
