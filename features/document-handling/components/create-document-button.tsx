import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { documentService } from '@/services/document-service'
import { CreateDocument } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

type ResourceItem = {
  id: string
  type: 'file' | 'link' | 'note'
  content: string | File
  displayName: string
}

interface CreateDocumentButtonProps {
  userId: string
  title: string
  description: string
  resourceItems: ResourceItem[]
  className?: string
}

export const CreateDocumentButton: React.FC<CreateDocumentButtonProps> = ({
  className,
  resourceItems,
  title,
  description,
  userId
}) => {
  const [documentCreationStatus, setDocumentCreationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDocumentCreationStatus('loading')

    const fileItems = resourceItems.filter(res => res.type === 'file' || res.type === 'note')
    const linkItems = resourceItems.filter(res => res.type === 'link')

    try {
      if (fileItems.length > 0) {
        // Use createDocumentManually for any file uploads
        const formData = new FormData()
        formData.append('user_id', userId)
        formData.append('document_alias', title)
        formData.append('description', description)

        if (linkItems.length > 0) {
          formData.append('link', linkItems[0].content as string) // Add only the first link
        }

        // Append actual File objects
        fileItems.forEach(fileItem => {
          if (fileItem.content instanceof File) {
            formData.append('file', fileItem.content, fileItem.content.name)
          }
        })

        const result = await documentService.createDocumentManually(formData)
        console.log('Document creation with file successful:', result)
      } else if (linkItems.length > 0) {
        // Use createDocumentSelection only for links without files
        const document: CreateDocument = {
          user_id: userId,
          links: linkItems.map(item => item.content as string),
          document_alias: title,
          description
        }
        const result = await documentService.createDocumentSelection(document)
        console.log('Document creation with links successful:', result)
      } else {
        throw new Error('No files or links provided')
      }

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
            <Loader2 className="size-4 animate-spin" />
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
    <Button
      variant="default"
      onClick={handleSubmit}
      disabled={documentCreationStatus === 'loading'}
      className={cn("relative", className)}
    >
      Submit
    </Button>
  )
}
