import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { documentService } from '@/services/document-service'
import { CreateWorker } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import {useResourceItemsStore} from "@/features/worker-creation/stores/useResourceItemsStore";

interface CreateWorkerButtonProps {
  userId: string
  title: string
  description: string
  className?: string
}

export const WorkerCreationButton: React.FC<CreateWorkerButtonProps> = ({
  className,
  title,
  description,
  userId
}) => {
  const [workerCreationStatus, setWorkerCreationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const {resourceItems} = useResourceItemsStore()

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setWorkerCreationStatus('loading')

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
        console.log('Worker creation with file successful:', result)
      } else if (linkItems.length > 0) {
        // Use createWorkerSelection only for links without files
        const document: CreateWorker = {
          user_id: userId,
          links: linkItems.map(item => item.content as string),
          document_alias: title,
          description
        }
        const result = await documentService.createDocumentSelection(document)
        console.log('Worker creation with links successful:', result)
      } else {
        throw new Error('No files or links provided')
      }

      setWorkerCreationStatus('success')
    } catch (error) {
      console.error('Error during worker creation:', error)
      setWorkerCreationStatus('error')
    }
  }

  const renderStatusMessage = () => {
    switch (workerCreationStatus) {
      case 'loading':
        return (
          <Alert className="mt-2">
            <Loader2 className="size-4 animate-spin" />
            <AlertTitle>Creating Worker...</AlertTitle>
            <AlertDescription>Please wait while we process your request.</AlertDescription>
          </Alert>
        )
      case 'success':
        return (
          <Alert className="mt-2">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Your Worker has been created.</AlertDescription>
          </Alert>
        )
      case 'error':
        return (
          <Alert variant="destructive" className="mt-2">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>There was a problem creating your Worker. Please try again.</AlertDescription>
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
      disabled={workerCreationStatus === 'loading'}
      className={cn("relative", className)}
    >
      Submit
    </Button>
  )
}
