import React from 'react';
import { DeleteDocument } from '@/lib/types'
import { documentService } from '@/services/document-service'


interface DeleteDocumentButtonProps extends DeleteDocument {
  onSuccess?: () => void
  className?: string
}

export const DeleteDocumentButton = ({
  user_id,
  document_id,
  onSuccess,
  className
}: DeleteDocumentButtonProps) => {

  const handleDelete = async () => {
    try {
      const document = {
        user_id: user_id,
        document_id: document_id
      };

      const result = await documentService.deleteDocument(document);
      console.log('Document deletion successful:', result);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error during document deletion:', error);
    }
  };

  return (
    <button type="button" onClick={handleDelete} className={className}>
      Delete
    </button>
  );
};

export default DeleteDocumentButton;