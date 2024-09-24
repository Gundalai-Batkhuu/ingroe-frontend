import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { documentService } from '@/services/document-service'
import { CreateDocument } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

interface CreateDocumentButtonProps extends CreateDocument {
  className?: string
}

export const CreateDocumentButton: React.FC<CreateDocumentButtonProps> = ({
  user_id,
  links,
  document_alias,
  description,
  className
}) => {
  const [documentCreationStatus, setDocumentCreationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDocumentCreationStatus('loading')

    try {
      const document: CreateDocument = {
        user_id,
        links,
        document_alias,
        description
      }

      const result = await documentService.createDocumentSelection(document)
      console.log('Document creation successful:', result)
      setDocumentCreationStatus('success')
    } catch (error) {
      console.error('Error during document creation:', error)
      setDocumentCreationStatus('error')
    }
  }

  const renderStatusMessage = () => {
    switch (documentCreationStatus) {
      case 'loading':
        return (
          <Alert className="mt-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Creating Knowledge Base...</AlertTitle>
            <AlertDescription>Please wait while we process your request.</AlertDescription>
          </Alert>
        )
      case 'success':
        return (
          <Alert className="mt-2">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Your Knowledge Base has been created.</AlertDescription>
          </Alert>
        )
      case 'error':
        return (
          <Alert variant="destructive" className="mt-2">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>There was a problem creating your Knowledge Base. Please try again.</AlertDescription>
          </Alert>
        )
      default:
        return null
    }
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col items-stretch">
        <Button
          variant="default"
          type="submit"
          disabled={documentCreationStatus === 'loading'}
          className="relative"
        >
          Create Knowledge Base
        </Button>
      </form>
      {renderStatusMessage()}
    </div>
  )
}