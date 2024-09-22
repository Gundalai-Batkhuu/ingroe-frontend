import React, { useState } from 'react';
import { documentService } from '@/services/document-service';

interface FileDocumentUploaderProps {
  userId: string;
  documentId?: string;
}

export const FileDocumentUploader: React.FC<FileDocumentUploaderProps> = ({ userId, documentId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('file', file);
    submitFormData.append('user_id', userId);
    if (documentId) submitFormData.append('document_id', documentId);

    try {
      const response = await documentService.createDocumentManually(submitFormData);
      setMessage(`${response.message} You can upload another file if needed.`);
      // Clear form field after successful upload
      setFile(null);
      if (event.target instanceof HTMLFormElement) {
        event.target.reset();
      }
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
          <label htmlFor="file" className="block text-xs font-medium mb-1">
            File
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="w-full bg-background text-foreground border border-input rounded-md shadow-sm px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          {file && (
            <p className="mt-1 text-xs text-muted-foreground">{file.name}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Upload File
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