import React from 'react';
import { DeleteWorker } from '@/lib/types'
import { documentService } from '@/services/document-service'
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';


interface DeleteWorkerButtonProps extends DeleteWorker {
  onSuccess?: () => void
  className?: string
}

export const DeleteWorkerButton = ({
  user_id,
  document_id,
  onSuccess,
  className
}: DeleteWorkerButtonProps) => {

  const handleDelete = async () => {
    try {
      const worker = {
        user_id: user_id,
        document_id: document_id
      };

      const result = await documentService.deleteDocument(worker);
      console.log('Document deletion successful:', result);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error during document deletion:', error);
    }
  };

  return (
    <Button variant="destructive" size="smIcon" onClick={handleDelete}>
      <Trash className="size-4" />
    </Button>
  );
};

export default DeleteWorkerButton;
