'use client';

import { ConfirmModal } from '@/components/modal/confirmModal';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Chapter } from '@prisma/client';
import axios from 'axios';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ChapterActionsProps {
  disabled: boolean;
  chapter: Chapter;
}
function ChapterActions({ disabled, chapter }: ChapterActionsProps) {
  const { id: chapterId, isPublished, courseId } = { ...chapter };
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onDelete = async () => {
    try {
      setIsLoading(true);
      const res = await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}`
      );

      toast.success('Course Deleted successfully');
      // router.refresh();
      router.push(`/teacher/courses/${courseId}`);
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
        const res = await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}`,
          { isPublished: true }
        );
      }
      if (isPublished) {
        const res = await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unPublish`,
          { isPublished: false }
        );
      }

      toast.success(
        `Course ${isPublished ? 'Unpublished' : 'published'} successfully`
      );
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
      <ConfirmModal onConfirm={onDelete}>
        <Button size={'sm'} disabled={isLoading}>
          <Trash2Icon className="w-4 h-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}

export default ChapterActions;
