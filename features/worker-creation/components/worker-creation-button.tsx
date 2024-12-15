'use client'

import { Button } from '@/components/ui/button'
import { documentService } from '@/services/document-service'
import { useResourceItemsStore } from '@/features/worker-creation/stores/useResourceItemsStore'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Toast, ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/hooks/use-toast'
import { ApiEndpoint } from '@/services/api_endpoints'
import { WorkerCreationSuccessDialog } from './worker-creation-success-dialog'

interface WorkerCreationButtonProps {
  userId: string
  title: string
  description: string
  className?: string
}

export function WorkerCreationButton({
  userId,
  title,
  description,
  className
}: WorkerCreationButtonProps) {
  const { resourceItems, clearResourceItems } = useResourceItemsStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const { toast } = useToast()

  const handleCreateWorker = async () => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Title is required",
        action: (
          <ToastAction altText="Try again">Try again</ToastAction>
        ),
      })
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      
      // Add user details
      formData.append('user_id', userId)
      formData.append('document_alias', title)
      formData.append('description', description || '')

      // Add files
      const files = resourceItems
        .filter(item => item.type === 'file')
        .map(item => item.content as File)
      
      files.forEach(file => {
        formData.append('file', file)
      })

      // Modify links handling - send only one link
      const links = resourceItems
        .filter(item => item.type === 'link')
        .map(item => item.content as string)
      
      // Only append the first link since the API expects a single link
      if (links.length > 0) {
        formData.append('link', links[0])
      }

      const payload = {
        user_id: userId,
        document_alias: title,
        description: description,
        files: files,
        links: links
      }
      console.log('Worker creation payload:', payload)
      await documentService.createWorker(formData)
      
      clearResourceItems()
      setShowSuccessDialog(true)
    } catch (error) {
      console.error('Error creating worker:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong while creating the worker",
        action: (
          <ToastAction altText="Try again">Try again</ToastAction>
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button 
        onClick={handleCreateWorker}
        className={className}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Create Worker'
        )}
      </Button>

      <WorkerCreationSuccessDialog 
        isOpen={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      />
    </>
  )
}
