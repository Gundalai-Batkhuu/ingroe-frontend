import React, { useState, ChangeEvent, FormEvent } from 'react';
import { documentService} from '@/services/document-service'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';



interface FormData {
  file: File | null;
  userId: string;
  documentId: string;
  documentAlias: string;
  description: string;
}

interface ApiResponse {
  message: string;
  user_id: string;
  document_id: string;
  captured_document_id: string;
  file_id: string;
  file_map: Record<string, string>;
}

interface HandwrittenDocumentUploadFormProps {
  userId: string;
}

const HandwrittenDocumentUploadForm = ({userId}: HandwrittenDocumentUploadFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    file: null,
    userId: userId,
    documentId: '',
    documentAlias: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const submitData = new FormData();
    if (formData.file) submitData.append('file', formData.file);
    submitData.append('user_id', formData.userId);
    if (formData.documentId) submitData.append('document_id', formData.documentId);
    if (formData.documentAlias) submitData.append('document_alias', formData.documentAlias);
    if (formData.description) submitData.append('description', formData.description);

    try {
      const { data } = await documentService.captureHandwrittenDocument(submitData);

      setMessage({ text: `Handwritten document uploaded successfully! File map: ${data.file_map}`, type: 'success' });
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'An unexpected error occurred', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="file">File</Label>
        <Input
          id="file"
          name="file"
          type="file"
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="userId">User ID</Label>
        <Input
          id="userId"
          name="userId"
          value={formData.userId}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="documentId">Document ID (optional)</Label>
        <Input
          id="documentId"
          name="documentId"
          value={formData.documentId}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="documentAlias">Document Alias (optional)</Label>
        <Input
          id="documentAlias"
          name="documentAlias"
          value={formData.documentAlias}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload Document'
        )}
      </Button>
      {message && (
        <div className={`mt-4 p-2 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}
    </form>
  );
};

export default HandwrittenDocumentUploadForm;