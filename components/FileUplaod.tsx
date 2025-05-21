import { UploadDropzone } from '@/lib/uploadthing';
import { ourFileRouter } from '@/app/api/uploadthing/core';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onChange: (url?: any) => void;
  endPoint: keyof typeof ourFileRouter;
  // endPoint: keyof OurFileRouter
}

export const FileUpload = ({ onChange, endPoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        console.log('Files: ', res);
        onChange(res[0]);
      }}
      onUploadError={(error: Error) => {
        console.log('[Error fileUpload]: ', JSON.stringify(error));
        toast.error(`${error?.message}`);
      }}
    />
  );
};
