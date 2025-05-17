import { UploadDropzone } from '@/lib/uploadthing';
import { ourFileRouter, OurFileRouter } from '@/app/api/uploadthing/core';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onChange: (url?: string) => void;
  endPoint: keyof typeof ourFileRouter;
  // endPoint: keyof OurFileRouter
}

export const FileUpload = ({ onChange, endPoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        console.log('Files: ', res);
        onChange(res[0].ufsUrl);
      }}
      onUploadError={(error: Error) => {
        console.log('[Error fileUpload]: ', JSON.stringify(error));
        toast.error(`${error?.message}`);
      }}
    />
  );
};
