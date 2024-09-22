import React, { useState, ChangeEvent, FormEvent } from 'react'
import { documentService } from '@/services/document-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { getTextFromS3 } from '@/features/handwriting-recognition/lib/get-text-from-url'

interface FormData {
  file: File | null
  userId: string
  documentId: string
  documentAlias: string
  description: string
}

interface HandwrittenDocumentUploadFormProps {
  userId: string
  setCapturedDocumentId: (id: string) => void
  setDocumentId: (id: string) => void
  setFileId: (id: string) => void
  setText: (text: string) => void
  setEditedText: (text: string) => void
  setFileName: (name: string) => void
}

const HandwrittenDocumentUploadForm = ({
  userId,
  setDocumentId,
  setFileId,
  setCapturedDocumentId,
  setText,
  setEditedText,
  setFileName
}: HandwrittenDocumentUploadFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    file: null,
    userId: userId,
    documentId: '',
    documentAlias: '',
    description: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === 'file' && files && files[0]) {
      setFormData(prev => ({
        ...prev,
        file: files[0]
      }))
      setFileName(files[0].name)
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const submitData = new FormData()
    if (formData.file) submitData.append('file', formData.file)
    submitData.append('user_id', formData.userId)
    if (formData.documentId)
      submitData.append('document_id', formData.documentId)
    if (formData.documentAlias)
      submitData.append('document_alias', formData.documentAlias)
    if (formData.description)
      submitData.append('description', formData.description)

    try {
      const response =
        await documentService.captureHandwrittenDocument(submitData)
      console.log('API Response:', response)
      if (response && response.file_id) {
        setDocumentId(response.document_id)
        setFileId(response.file_id)
        setCapturedDocumentId(response.captured_document_id)

        try {
          const text = await getTextFromS3(response.file_map.file_url)
          setText(text)
          setEditedText(text)
        } catch (error) {
          console.error('Error getting text from S3:', error)
        }

        setMessage({
          text: `Handwritten document uploaded successfully! 
                 File ID: ${response.file_id}
                 Document ID: ${response.document_id}
                 Captured Document ID: ${response.captured_document_id}
                 `,
          type: 'success'
        })
      } else {
        throw new Error('Unexpected response format')
      }
    } catch (err) {
      console.error('Error uploading document:', err)
      setMessage({
        text:
          err instanceof Error ? err.message : 'An unexpected error occurred',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

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
        <div
          className={`mt-4 p-2 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
        >
          <pre>{message.text}</pre>
        </div>
      )}
    </form>
  )
}

export default HandwrittenDocumentUploadForm
