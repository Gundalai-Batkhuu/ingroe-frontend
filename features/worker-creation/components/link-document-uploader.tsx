import React, { useState } from 'react';
import { TextInputWithClearButton } from '@/components/ui/text-input-with-clear-button';
import { documentService } from '@/services/document-service';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface LinkDocumentUploaderProps {
  userId: string;
  documentId?: string;
}

export const LinkDocumentUploader = ({ userId, documentId }: LinkDocumentUploaderProps) => {
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    if (!link) {
      setStatus('error');
      setMessage('Please provide a link');
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('link', link);
    submitFormData.append('user_id', userId);
    if (documentId) submitFormData.append('document_id', documentId);

    try {
      const response = await documentService.createDocumentManually(submitFormData);
      setStatus('success');
      setMessage(`${response.message} You can upload another link if needed.`);
      setLink(''); // This will trigger the TextInputWithClearButton to clear
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
          <label htmlFor="link" className="block text-xs font-medium mb-1">
            Link
          </label>
          {/*<TextInputWithClearButton*/}
          {/*  onChange={setLink}*/}
          {/*  placeholder="https://example.com"*/}
          {/* onKeyPress=*/}
        </div>
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full"
        >
          Upload Link
        </Button>
      </form>
      {renderStatusMessage()}
    </div>
  );
};