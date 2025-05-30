'use client';

import { ConfirmModal } from '@/components/modal/confirmModal';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/useConfettiStore';
import { Chapter, Course } from '@prisma/client';
import axios from 'axios';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface CourseActionsProps {
  disabled: boolean;
  course: Course;
}
function CourseActions({ disabled, course }: CourseActionsProps) {
  const { id: courseId, isPublished } = { ...course };
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen } = useConfettiStore();
  const router = useRouter();
  const onDelete = async () => {
    try {
      setIsLoading(true);
      const res = await axios.delete(`/api/courses/${courseId}`);

      toast.success('Course Deleted successfully');
      // router.refresh();
      router.push(`/teacher/courses`);
    } catch (e) {
      toast.error('Something went wrong');
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onPublishClick = async () => {
    try {
      setIsLoading(true);

      if (!isPublished) {
        const res = await axios.patch(`/api/courses/${courseId}/publish`, {
          isPublished: true,
        });
      }
      if (isPublished) {
        const res = await axios.patch(`/api/courses/${courseId}/unpublish`, {
          isPublished: false,
        });
      }

      if (isPublished) {
        toast.success(`Course Unpublished successfully`);
      } else {
        toast.success(`Course published successfully`);
        onOpen();
      }

      // router.refresh();
      router.refresh();
    } catch (e) {
      toast.error('Something went wrong');
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={() => onPublishClick()}
        disabled={disabled || isLoading}
        variant={'outline'}
        size={'sm'}
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal
        onConfirm={onDelete}
        label={` This action cannot be undone. This will permanently delete your course and remove your data from our servers.`}
      >
        <Button size={'sm'} disabled={isLoading}>
          <Trash2Icon className="w-4 h-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}

export default CourseActions;
