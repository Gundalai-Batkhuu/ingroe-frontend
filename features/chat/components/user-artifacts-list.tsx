"use client"

import * as React from 'react'
import { useUserArtifactsStore } from '@/stores/userArtifactsStore'
import { Artefact } from '@/lib/types'
import { useEffect, useState, useCallback } from 'react'
import { UserArtifact } from '@/features/chat/components/user-artifact'

interface UserArtifactsListProps {
  userId: string
}

export function UserArtifactsList({ userId }: UserArtifactsListProps) {
  const { artifacts, isLoading, error, fetchUserArtifacts, selectedArtifactId, setSelectedArtifactId } = useUserArtifactsStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const refreshArtifacts = useCallback(() => {
    fetchUserArtifacts(userId)
  }, [userId, fetchUserArtifacts])

  useEffect(() => {
    refreshArtifacts()
  }, [refreshArtifacts])

  useEffect(() => {
    if (artifacts && artifacts.artefact_tree.length > 0 && !selectedArtifactId) {
      console.log('No artifact selected, selecting the first one')
      const firstArtifactId = artifacts.artefact_tree[0].document_id
      setSelectedArtifactId(firstArtifactId)
    }
  }, [artifacts, selectedArtifactId, setSelectedArtifactId])

  useEffect(() => {
    if (selectedArtifactId) {
      console.log('Expanding selected artifact:', selectedArtifactId)
      setExpandedId(selectedArtifactId)
    }
  }, [selectedArtifactId])

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
      <div className="flex items-center justify-between p-4">
        <h4 className="font-bold">Document Collection</h4>
      </div>
      <div className="grow overflow-auto px-2 space-y-3">
          {artifacts.artefact_tree.map((artifact: Artefact) => (
            <UserArtifact
              key={artifact.document_id}
              artifact={artifact}
              isExpanded={expandedId === artifact.document_id}
              isSelected={selectedArtifactId === artifact.document_id}
              onToggleExpand={() => toggleExpand(artifact.document_id)}
              onSelect={() => handleSelect(artifact.document_id)}
              userId={userId}
              onDelete={refreshArtifacts}
            />
          ))}
      </div>
    </div>
  )
}