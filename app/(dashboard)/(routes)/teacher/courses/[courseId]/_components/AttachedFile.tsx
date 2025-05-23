import { Attachment, Course } from '@prisma/client';
import axios from 'axios';
import { File, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface AttachmentsFormProps {
  initialData: Course & { attachments: Attachment[] };
  attribute: Attachment;
}

function AttachedFile({ initialData, attribute }: AttachmentsFormProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
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
    <div className="pt-3 flex items-center gap-2 text-sky-700  mt-2  p-2 bg-sky-200 rounded-md border border-sky-300 ">
      <File className="w-4 h-4" />
      <p className="italic text-sm line-clamp-1">{attribute.name}</p>
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin ml-auto" />
      ) : (
        <button
          onClick={() => onDeleteAttachment(attribute.id)}
          className="ml-auto"
        >
          <X className="hove:opacity-75 transition" />
        </button>
      )}
    </div>
  );
}

export default AttachedFile;
