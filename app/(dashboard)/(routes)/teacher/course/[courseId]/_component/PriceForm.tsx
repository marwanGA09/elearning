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
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Textarea } from '@/components/ui/textarea';
import { cx } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Course } from '@prisma/client';
import { formatPrice } from '@/lib/format';
interface PriceFormProps {
  initialData: Course;
}

const formSchema = z.object({
  // price: z.coerce().number().min(0, {
  //   message: 'price is required',
  // }),
  price: z.coerce.number().min(0, {
    message: 'price is required',
  }),
});

function PriceForm({ initialData }: PriceFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => {
    setIsEditing((edit) => !edit);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { price: initialData.price || undefined },
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
        Course Price
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil /> Edit price
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.price && 'text-slate-500 italic'
          )}
        >
          {initialData?.price ? formatPrice(initialData.price) : 'NA'}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-8"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      className="bg-white"
                      placeholder="eg. '100'"
                      {...field}
                      disabled={isSubmitting}
                      step="0.01"
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

export default PriceForm;
