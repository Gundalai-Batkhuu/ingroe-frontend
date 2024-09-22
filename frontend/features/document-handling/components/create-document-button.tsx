import React from 'react'
import { Button } from '@/components/ui/button'
import { documentService } from '@/services/document-service'
import { CreateDocument } from '@/lib/types'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const document: CreateDocument = {
        user_id,
        links,
        document_alias,
        description
      }

      const result = await documentService.createDocumentSelection(document)
      console.log('Document creation successful:', result)

    } catch (error) {
      console.error('Error during document creation:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex items-stretch ${className || ''}`}>
      <Button variant="default">
        Create Knowledge Base
      </Button>
    </form>
  )
}