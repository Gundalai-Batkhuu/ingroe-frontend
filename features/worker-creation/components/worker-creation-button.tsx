'use client'

import { Button } from '@/components/ui/button'
import { documentService } from '@/services/document-service'
import { useResourceItemsStore } from '@/features/worker-creation/stores/useResourceItemsStore'
import { useState } from 'react'
import { Toast } from '@/components/ui/toast'

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

  const handleCreateWorker = async () => {
    try {
      if (!title.trim()) {
        console.error('Title is required')
        return
      }

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

      await documentService.createWorker(formData)
      clearResourceItems()
    } catch (error) {
      console.error('Error creating worker:', error)
    }
  }

  return (
    <Button 
      onClick={handleCreateWorker}
      className={className}
    >
      Create Worker
    </Button>
  )
}
