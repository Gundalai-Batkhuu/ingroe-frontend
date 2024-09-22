import React, { useState } from 'react';
import { TextInputWithClearButton } from '@/components/ui/text-input-with-clear-button';
import { documentService } from '@/services/document-service';

interface LinkDocumentUploaderProps {
  userId: string;
  documentId?: string;
}

export const LinkDocumentUploader = ({ userId, documentId }: LinkDocumentUploaderProps) => {
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!link) {
      setMessage('Please provide a link');
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('link', link);
    submitFormData.append('user_id', userId);
    if (documentId) submitFormData.append('document_id', documentId);

    try {
      const response = await documentService.createDocumentManually(submitFormData);
      setMessage(`${response.message} You can upload another link if needed.`);
      // Clear form field after successful upload
      setLink('');
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An error occurred while uploading the document');
      }
    }
  };

  return (
    <div className="w-full max-w-md p-4 space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="mb-6">
          <label htmlFor="link" className="block text-xs font-medium mb-1">
            Link
          </label>
          <TextInputWithClearButton
            onChange={setLink}
            placeholder="https://example.com"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Upload Link
        </button>
      </form>
      {message && (
        <div
          className={`mt-4 p-4 border rounded-md text-sm ${
            message.startsWith('Error')
              ? 'bg-destructive/15 border-destructive text-destructive'
              : 'bg-primary/15 border-primary text-primary'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};