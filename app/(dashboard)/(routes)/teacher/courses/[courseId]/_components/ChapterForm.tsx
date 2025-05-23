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
import { Input } from '@/components/ui/input';
import { Pencil, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Textarea } from '@/components/ui/textarea';
import { cx } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Chapter, Course } from '@prisma/client';
import { title } from 'process';
import DroppableChapter from './DroppableChapter';
interface ChapterFormProps {
  initialData: Course & { chapters: Chapter[] };
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'title is required',
  }),
});

function ChapterForm({ initialData }: ChapterFormProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const toggleCreating = () => {
    setIsCreating((edit) => !edit);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post(
        `/api/courses/${initialData.id}/chapters`,
        value
      );

      form.reset();
      toggleCreating();
      toast.success('Chapter created successfully');
      router.refresh();
    } catch (e) {
      toast.error('Something went wrong');
      console.log(e);
    }
  };

  return (
    <div className="mt-6 rounded-md bg-slate-100 border p-4">
      <div className="flex justify-between items-center font-medium">
        Course Chapter
        <Button onClick={toggleCreating} variant={'ghost'}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle /> Add Chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="e.g. 'Introduction to ...'"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      )}

      {!isCreating && (
        <p
          className={cn(
            'text-sm mt-2',
            initialData.chapters.length && 'bg-slate-500 italic'
          )}
        >
          {!initialData.chapters.length && 'No course'}
        </p>
      )}

      {!isCreating && (
        // <div>
        //   {initialData.chapters.map((chapter) => (
        //     <div key={chapter.id}>{chapter.title}</div>
        //   ))}
        // </div>
        <DroppableChapter chaptersProp={initialData.chapters} />
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the chapter
        </p>
      )}
    </div>
  );
}

export default ChapterForm;
