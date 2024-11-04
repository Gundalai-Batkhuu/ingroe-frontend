'use client'

import { Button } from '@/components/ui/button'
import { documentService } from '@/services/document-service'
import { useResourceItemsStore } from '@/features/worker-creation/stores/useResourceItemsStore'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Toast, ToastAction } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
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
      formData.append('description', description)

      // Add files
      const files = resourceItems
        .filter(item => item.type === 'file')
        .map(item => item.content as File)
      
      files.forEach(file => {
        formData.append('file', file)
      })

      // Add links
      const links = resourceItems
        .filter(item => item.type === 'link')
        .map(item => item.content as string)
      
      links.forEach(link => {
        formData.append('link', link)
      })

      // Log the payload
      const payload = {
        user_id: userId,
        document_alias: title,
        description,
        files: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
        links
      }
      console.log('Worker creation payload:', payload)
      console.log('API_BASE_URL_V2: ', ApiEndpoint.CREATE_WORKER)
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
