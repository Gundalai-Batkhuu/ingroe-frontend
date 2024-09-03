import * as React from 'react'
import { useUserArtifactsStore } from '@/app/lib/store/userArtifactsStore'
import { Artefact } from '@/app/lib/types'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { DeleteDocumentButton } from '@/app/components/delete-document-button'

interface UserArtifactsListProps {
  userId: string
}

const truncateString = (str: string, maxLength: number) => {
  return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str
}

export function UserArtifactsList({ userId }: UserArtifactsListProps) {
  const { artifacts, isLoading, error, fetchUserArtifacts, selectedArtifactId, setSelectedArtifactId } = useUserArtifactsStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchUserArtifacts(userId)
  }, [userId, fetchUserArtifacts])

  useEffect(() => {
    if (artifacts && artifacts.artefact_tree.length > 0) {
      const firstArtifactId = artifacts.artefact_tree[0].document_id
      setExpandedId(firstArtifactId)
      setSelectedArtifactId(firstArtifactId)
    }
  }, [artifacts, setSelectedArtifactId])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!artifacts || artifacts.artefact_tree.length === 0) return <div>No artifacts found.</div>

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleSelect = (id: string) => {
    setSelectedArtifactId(id === selectedArtifactId ? null : id)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-4">
        <h4 className="text-sm font-medium">Document store</h4>
      </div>
      <div className="flex-grow overflow-auto">
        <div className="space-y-2">
          {artifacts.artefact_tree.map((artifact: Artefact) => (
            <div
              key={artifact.document_id}
              className={`cursor-pointer ${selectedArtifactId === artifact.document_id ? 'bg-accent' : ''} border p-2 rounded relative`}
            >
              <div className="flex items-center pr-8">
                <button
                  onClick={() => toggleExpand(artifact.document_id)}
                  className="p-1"
                >
                  {expandedId === artifact.document_id ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                <span
                  className={`cursor-pointer ${selectedArtifactId === artifact.document_id ? 'font-bold' : ''} truncate flex-grow`}
                  onClick={() => handleSelect(artifact.document_id)}
                  title={artifact.document_id}
                >
                  {artifact.document_name === ''
                    ? truncateString(artifact.document_id, 20)
                    : truncateString(artifact.document_name, 20)}
                </span>
                <DeleteDocumentButton document_id={artifact.document_id} user_id={userId} />
              </div>
              {expandedId === artifact.document_id && (
                <div className="ml-6 mt-2 text-sm">
                  <p>Name: {artifact.document_name}</p>
                  <p>Description: {artifact.description}</p>
                  <p>Vanilla Links: {artifact.vanilla_links.length}</p>
                  <p>File Links: {artifact.file_links.length}</p>
                  <p>Files: {artifact.files.length}</p>
                  <p>
                    Captured Documents: {artifact.captured_documents.length}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}