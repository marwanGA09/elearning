'use client';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  FormField,
  FormControl,
  Form,
  FormMessage,
  FormItem,
} from '@/components/ui/form';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Chapter, Course } from '@prisma/client';
import Tiptap from '@/components/Editor';
interface ChapterDescriptionFormProps {
  initialData: Chapter;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: 'description is required',
  }),
});

function ChapterDescriptionForm({ initialData }: ChapterDescriptionFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => {
    setIsEditing((edit) => !edit);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: initialData.description || '' },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      console.log('Value', { value }, typeof value);
      const res = await axios.patch(
        `/api/courses/${initialData.courseId}/chapters/${initialData.id}`,
        value
      );
      console.log({ res });
      toggleEdit();
      toast.success('Chapter updated successfully');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    }
  };

  return (
    <div className="mt-6 rounded-md bg-slate-100 border p-4">
      <div className="flex justify-between items-center font-medium">
        Chapter Description
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil /> Edit Chapter
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.description && 'text-slate-500 italic'
          )}
        >
          {initialData.description ? (
            <div
              className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl"
              dangerouslySetInnerHTML={{ __html: initialData.description }}
            />
          ) : (
            'No description'
          )}{' '}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-8"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* <Textarea
                      className="bg-white"
                      placeholder="e.g. 'This is a course about ...'"
                      {...field}
                      disabled={isSubmitting}
                    /> */}
                    <Tiptap
                      content={initialData?.description || ''}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

export default ChapterDescriptionForm;
