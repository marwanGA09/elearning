'use client';
import axios from 'axios';
import { Schema, z } from 'zod';
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
import { Link, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
interface TitleFormProps {
  initialData: {
    title: string;
    id: string;
  };
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
});

function TitleForm({ initialData }: TitleFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(true);
  const toggleEdit = () => {
    setIsEditing((edit) => !edit);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isLoading, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.patch(`/api/courses/${initialData.id}`, value);

      console.log({ res });
      toggleEdit();
      router.refresh();
    } catch (e) {
      toast.error('Something went wrong');
      console.log(e);
    }
    console.log({ value });
  };

  return (
    <div className="mt-6 rounded-md bg-slate-100 border p-4">
      <div className="flex justify-between items-center font-medium">
        Course Title
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil /> Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p className="text-sm mt-2">{initialData.title} </p>
      ) : (
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
                      placeholder="e.g. 'Web Development'"
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
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

export default TitleForm;
