"use client"

import * as React from 'react'
import { useUserArtifactsStore } from '@/app/lib/store/userArtifactsStore'
import { Artifact } from '@/app/lib/types'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface UserArtifactsListProps {
  userId: string
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
    <div className="space-y-2">
      {artifacts.artefact_tree.map((artifact: Artifact) => (
        <div key={artifact.document_id} className="border p-2 rounded">
          <div className="flex items-center space-x-2">
            <button onClick={() => toggleExpand(artifact.document_id)} className="p-1">
              {expandedId === artifact.document_id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            <span
              className={`cursor-pointer ${selectedArtifactId === artifact.document_id ? 'font-bold' : ''}`}
              onClick={() => handleSelect(artifact.document_id)}
            >
              {artifact.document_id}
            </span>
          </div>
          {expandedId === artifact.document_id && (
            <div className="ml-6 mt-2 text-sm">
              <p>Name: {artifact.document_name}</p>
              <p>Description: {artifact.description}</p>
              <p>Vanilla Links: {artifact.vanilla_links.length}</p>
              <p>File Links: {artifact.file_links.length}</p>
              <p>Files: {artifact.files.length}</p>
              <p>Captured Documents: {artifact.captured_documents.length}</p>
            </div>
          )}
        </div>
      ))}
      <div className="mt-4">
        <strong>Selected Document ID:</strong> {selectedArtifactId || 'None'}
      </div>
    </div>
  )
}