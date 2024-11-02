import React, { useState } from 'react'
import { TextInputWithClearButton } from '@/components/ui/text-input-with-clear-button'
import { documentService } from '@/services/document-service'

interface ManualDocumentUploaderProps {
  userId: string
}

export const ManualDocumentUploader = ({
  userId
}: ManualDocumentUploaderProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [link, setLink] = useState('')
  const [documentId, setDocumentId] = useState('')
  const [documentAlias, setDocumentAlias] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    if (!file && !link) {
      setMessage('Please provide either a file or a link')
      return
    }

    const submitFormData = new FormData()
    if (file) submitFormData.append('file', file)
    if (link) submitFormData.append('link', link)
    submitFormData.append('user_id', userId)
    if (documentId) submitFormData.append('document_id', documentId)
    if (documentAlias) submitFormData.append('document_alias', documentAlias)
    if (description) submitFormData.append('description', description)

    // Log the form data sent (excluding file)
    console.log('Form data sent (excluding file):')
    submitFormData.forEach((value, key) => {
      if (key !== 'file') {
        console.log(`${key}: ${value}`)
      }
    })

    try {
      const response = await documentService.createDocumentManually(submitFormData)
      setMessage(`${response.message} You can upload another file if needed.`)
      // Clear form fields after successful upload
      setFile(null)
      setLink('')
      setDocumentId('')
      setDocumentAlias('')
      setDescription('')
      if (event.target instanceof HTMLFormElement) {
        event.target.reset()
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage('An error occurred while uploading the document')
      }
    }
  }

  return (
    <div className="w-full max-w-md p-4 space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="mb-6">
          <label htmlFor="file" className="block text-xs font-medium mb-1">
            File
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="w-full bg-background text-foreground border border-input rounded-md shadow-sm px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          {file && (
            <p className="mt-1 text-xs text-muted-foreground">{file.name}</p>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="link" className="block text-xs font-medium mb-1">
            Link (optional)
          </label>
          <input
            type="text"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full bg-background text-foreground border border-input rounded-md shadow-sm px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="https://example.com"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="document_id"
            className="block text-xs font-medium mb-1"
          >
            Document ID (optional)
          </label>
          <input
            type="text"
            id="document_id"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            className="w-full bg-background text-foreground border border-input rounded-md shadow-sm px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="document_alias"
                 className="block text-xs font-medium mb-1">
            Title (Optional)
          </label>
          <TextInputWithClearButton
            onChange={setDocumentAlias}
            onKeyPress={() => {}}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-xs font-medium mb-1"
          >
            Description (Optional)
          </label>
          <TextInputWithClearButton
            onChange={setDocumentAlias}
            onKeyPress={() => {}}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Upload File
        </button>
      </form>
      {message && (
        <div
          className={`mt-4 p-4 border rounded-md text-sm ${
            message.startsWith('Error')
              ? 'bg-destructive/15 border-destructive text-destructive'
              : 'bg-primary/15 border-primary text-primary'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}