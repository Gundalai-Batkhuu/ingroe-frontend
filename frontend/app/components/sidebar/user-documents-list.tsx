import * as React from 'react'
import { cn } from '../../lib/utils'
import { buttonVariants } from '../button'
import { cache } from 'react'

// This is a placeholder function. You'll need to implement this for document management.
const getDocuments = cache(async (userId?: string) => {
  // Placeholder: fetch documents for the user
  return []
})

interface UserDocumentsListProps {
  userId?: string
}

const loadDocuments = cache(async (userId?: string) => {
  return await getDocuments(userId)
})

export async function UserDocumentsList({ userId }: UserDocumentsListProps) {
  const documents = await loadDocuments(userId)

  const sampleData = {
    "user_id": "123",
    "artefact_tree": [
      {
        "document_id": "96e2ae0640684782949ed04debe48731",
        "document_name": "First document",
        "description": "Checking if it works",
        "captured_documents": [
          {
            "captured_document_id": "20b79474a6f34e448c2ec38b757f3124",
            "captured_files": [
              { "file_name": "new.txt" }
            ]
          }
        ]
      }
    ]
  };

  return (
    <div>
      <h2>Your Documents</h2>
      {sampleData.artefact_tree.length > 0 ? (
        <ul>
          {sampleData.artefact_tree.map((item) => (
            <li key={item.document_id}>
              <h3>{item.document_name}</h3>
              <p>{item.description}</p>
              <p>Captured documents: {item.captured_documents.length}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No documents found.</p>
      )}
    </div>
  )
}
