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
  FormDescription,
} from '@/components/ui/form';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Chapter, Course } from '@prisma/client';
import { Checkbox } from '@/components/ui/checkbox';
interface PriceFormProps {
  initialData: Chapter;
}

const formSchema = z.object({
  isFree: z.boolean(),
});

function PriceForm({ initialData }: PriceFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => {
    setIsEditing((edit) => !edit);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { isFree: Boolean(initialData.isFree) },
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
        Chapter Access
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil /> Edit Access
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.isFree && 'text-slate-500 italic'
          )}
        >
          {initialData.description
            ? ' This Chapter is free for preview'
            : '  This Chapter is not free'}{' '}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-8"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row item-start space-x-3 space-y-0 rounded-md border p-4 ">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-1">
                    {' '}
                    <FormDescription>
                      Check this box if you want to make this chapter free for
                      review
                    </FormDescription>{' '}
                  </div>
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

export default PriceForm;
