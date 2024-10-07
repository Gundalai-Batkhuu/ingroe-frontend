import React, { useState } from 'react';
import { documentService } from '@/services/document-service';
import { AcceptSharedDocument } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AcceptDocumentSharingRequestProps {
  userId: string;
  userEmail: string;
}

export default function AcceptDocumentSharingRequest({ userId, userEmail }: AcceptDocumentSharingRequestProps) {
  const [shareId, setShareId] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const payload: AcceptSharedDocument = {
      email: userEmail,
      share_id: shareId,
      user_id: userId,
      verification_token: verificationToken,
      accept_time: new Date()
    };

    try {
      console.log('Accepting document sharing request:', payload);
      const response = await documentService.acceptSharedDocument(payload);
      console.log('Document sharing accepted:', response);
      setSuccess(true);
    } catch (err) {
      setError('Failed to accept document sharing. Please try again.');
      console.error('Error accepting document sharing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Accept Document Sharing Request</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="shareId" className="block text-sm font-medium text-gray-700">Share ID</label>
          <Input
            id="shareId"
            type="text"
            value={shareId}
            onChange={(e) => setShareId(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="verificationToken" className="block text-sm font-medium text-gray-700">Verification Token</label>
          <Input
            id="verificationToken"
            type="text"
            value={verificationToken}
            onChange={(e) => setVerificationToken(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Accepting...' : 'Accept Sharing Request'}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mt-4">
          <AlertDescription>Document sharing request accepted successfully!</AlertDescription>
        </Alert>
      )}
    </div>
  );
}