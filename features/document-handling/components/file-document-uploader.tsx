import React, { useState, useRef } from 'react';
import { documentService } from '@/services/document-service';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface FileDocumentUploaderProps {
  userId: string;
  documentId?: string;
}

export const FileDocumentUploader: React.FC<FileDocumentUploaderProps> = ({ userId, documentId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    if (!file) {
      setStatus('error');
      setMessage('Please select a file');
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('file', file);
    submitFormData.append('user_id', userId);
    if (documentId) submitFormData.append('document_id', documentId);

    try {
      const response = await documentService.createDocumentManually(submitFormData);
      setStatus('success');
      setMessage(`${response.message} You can upload another file if needed.`);
      // Clear form field after successful upload
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setStatus('error');
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An error occurred while uploading the document');
      }
    }
  };

  const renderStatusMessage = () => {
    switch (status) {
      case 'loading':
        return (
          <Alert className="mt-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>Please wait while we process your request.</AlertDescription>
          </Alert>
        );
      case 'success':
        return (
          <Alert className="mt-2">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        );
      case 'error':
        return (
          <Alert variant="destructive" className="mt-2">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        );
      default:
        return null;
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
            ref={fileInputRef}
            onChange={handleFileChange}
            className="w-full bg-background text-foreground border border-input rounded-md shadow-sm px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          {file && (
            <p className="mt-1 text-xs text-muted-foreground">{file.name}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full"
        >
          Upload File
        </Button>
      </form>
      {renderStatusMessage()}
    </div>
  );
};