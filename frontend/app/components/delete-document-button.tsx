import React from 'react'
import { documentService } from '@/app/lib/services/document-service'
import { DeleteDocument } from '@/app/lib/types'


export const DeleteDocumentButton = ({
  user_id,
  document_id
}: DeleteDocument) => {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const document: DeleteDocument = {
        user_id: user_id,
        document_id: document_id
      }

      const result = await documentService.deleteDocument(
        document
      )
      console.log('Document deletion successful:', result)

    } catch (error) {
      console.error('Error during document deletion:', error)
    }
  }

  return (
    <button
      type="button"
      onClick={handleSubmit}
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd" />
      </svg>
    </button>
  )
}
