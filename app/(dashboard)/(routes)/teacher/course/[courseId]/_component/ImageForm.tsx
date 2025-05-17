'use client';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  FormField,
  FormControl,
  FormDescription,
  FormLabel,
  Form,
  FormMessage,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ImageIcon, Pencil, PlusCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Textarea } from '@/components/ui/textarea';
import { cx } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Course } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/FileUplaod';
interface ImageFormProps {
  initialData: Course;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: 'Image url is required',
  }),
});

function ImageForm({ initialData }: ImageFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(true);
  const toggleEdit = () => {
    setIsEditing((edit) => !edit);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { imageUrl: initialData.imageUrl || '' },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.patch(`/api/courses/${initialData.id}`, value);

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
        Course Image
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing ? (
            <>Cancel</>
          ) : initialData.imageUrl ? (
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
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              alt={'upload'}
              src={initialData.imageUrl}
              fill
              className="object-cover rounded-md"
            />
          </div>
        )
      ) : (
        <div className="">
          <FileUpload
            endPoint="courseImage"
            onChange={(ufsUrl) => {
              if (ufsUrl) {
                onSubmit({ imageUrl: ufsUrl });
              }
            }}
          />
          <div className="text-sm mt-2 text-muted-foreground">
            {' '}
            16:9 aspect ration is recommended
          </div>{' '}
        </div>
      )}
    </div>
  );
}

export default ImageForm;
