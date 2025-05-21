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
import {
  File,
  ImageIcon,
  Loader2,
  Pencil,
  PlusCircleIcon,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Textarea } from '@/components/ui/textarea';
import { cx } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Attachment, Course } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/FileUplaod';
import AttachedFile from './AttachedFile';
interface AttachmentsFormProps {
  initialData: Course & { attachments: Attachment[] };
}

const formSchema = z.object({
  url: z.string().min(1, {
    message: ' url is required',
  }),
});

function AttachmentsForm({ initialData }: AttachmentsFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toggleEdit = () => {
    setIsEditing((edit) => !edit);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: initialData.attachments[0]?.url || '' },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post(
        `/api/courses/${initialData.id}/attachments`,
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

  const onDeleteAttachment = async (attachmentId: string) => {
    try {
      setIsDeleting(true);
      const res = await axios.delete(
        `/api/courses/${initialData.id}/attachments/${attachmentId}`
      );

      console.log({ res });
      toast.success('Attachment deleted successfully');
      router.refresh();
    } catch (e) {
      toast.error('Something went wrong');
      console.log(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-6 rounded-md bg-slate-100 border p-4">
      <div className="flex justify-between items-center font-medium">
        Course Attachment
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              {' '}
              <PlusCircleIcon /> Add File
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        initialData.attachments.length === 0 ? (
          <div className="italic text-sm mt-2 text-slate-500">
            No attachment yet
          </div>
        ) : (
          <div className="space-y-2">
            {initialData.attachments.map((att) => {
              return (
                <AttachedFile
                  key={att.name}
                  initialData={initialData}
                  attribute={att}
                />
              );
            })}
          </div>
        )
      ) : (
        <div className="">
          <FileUpload
            endPoint="courseAttachment"
            onChange={(ufsUrl) => {
              console.log('value from FileUpload ', { ufsUrl });
              if (ufsUrl) {
                onSubmit({ url: ufsUrl });
              }
            }}
          />
          <div className="text-sm mt-2 text-muted-foreground">
            {' '}
            Add any file that seems helpful
          </div>{' '}
        </div>
      )}
    </div>
  );
}

export default AttachmentsForm;
