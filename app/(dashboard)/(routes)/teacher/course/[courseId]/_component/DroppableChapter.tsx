'use client';

import { Course, Chapter } from '@prisma/client';

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Badge, BookCheck, Grip, Loader2, Pencil } from 'lucide-react';
import { checkIsAppPPREnabled } from 'next/dist/server/lib/experimental/ppr';

interface DroppableChapterProps {
  chaptersProp: Chapter[];
}

function DroppableChapter({ chaptersProp }: DroppableChapterProps) {
  const [chapters, setChapters] = useState(chaptersProp);
  const [isMounted, setIsMounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  // NOTE use useEffect for hydration Error. this component should be rendered only on Client side.
  useEffect(() => setIsMounted(true), []);
  useEffect(() => {
    setChapters(chaptersProp);
  }, [chaptersProp]);
  if (!isMounted) {
    return null;
  }
  const onDragEnd = async (result: DropResult) => {
    try {
      setIsUpdating(true);

      console.log({ result });
      const { destination, source } = result;

      // If no destination (e.g., dropped outside), or same spot
      if (!destination || destination.index === source.index) return;

      const updated = Array.from(chapters);
      console.log({ updated });
      const [moved] = updated.splice(source.index, 1);

      updated.splice(destination.index, 0, moved);
      setChapters(updated);
      const updatedChapter = await axios.put(
        `/api/courses/${chapters[0].courseId}/chapters`,
        updated
      );

      console.log({ updatedChapter });
      router.refresh();
    } catch (e) {
      console.log('Error');
      toast.error("Can't update chapter");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEditChapter = async (chapter: Chapter) => {
    router.push(`/teacher/courses/${chapter.courseId}/chapters/${chapter.id}`);
  };

  return (
    <div className="relative">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {chapters.map((chapter, index) => (
                <Draggable
                  key={chapter.id}
                  draggableId={chapter.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        'flex items-center gap-y-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm ',
                        chapter.isPublished &&
                          'bg-sky-100 border-sky-200 text-sky-700'
                      )}
                    >
                      {' '}
                      <div
                        className={cn(
                          'px-2 py-3 border-r border-r-slate-200 hover:border-r-slate-300 hover:bg-slate-400 rounded-l-md transition',
                          chapter.isPublished && 'border-sky-200 bg-sky-200 '
                        )}
                        {...provided.dragHandleProps}
                      >
                        <Grip className="h-5 w-5" />
                      </div>
                      <div className="pl-2">{chapter.title}</div>
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        {chapter.isFree && (
                          <div className="px-3 py-1 bg-slate-600 rounded-xl text-slate-300">
                            free
                          </div>
                        )}

                        <div
                          className={cn(
                            'px-3 py-1 bg-slate-600 rounded-xl text-slate-300',
                            chapter.isPublished && 'bg-sky-700'
                          )}
                        >
                          {chapter.isPublished ? 'Published' : 'Draft'}
                        </div>
                        <Pencil
                          onClick={() => onEditChapter(chapter)}
                          className="w-4 h-4 cursor-pointer hover:opacity-70 transition-all"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>{' '}
      {isUpdating && (
        <div className="absolute w-full h-full bg-slate-500/20 top-0 left-0 rounded-md flex justify-center items-center">
          <Loader2 className="w-5 h-5 animate-spin text-sky-700" />
        </div>
      )}
    </div>
  );
}

export default DroppableChapter;
