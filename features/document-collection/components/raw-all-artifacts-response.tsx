'use client'

import React, { useState, useEffect } from 'react'
import { userService } from '@/services/user-service'

interface AllArtifactsTableProps {
  userId: string
}

export function RawAllArtifactsResponse({ userId }: AllArtifactsTableProps) {
  const [artifacts, setArtifacts] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const response = await userService.getUserArtifacts(userId)
        setArtifacts(response)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
        console.error('Error fetching artifacts:', err)
      }
    }

    fetchArtifacts()
  }, [userId])

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!artifacts) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>Raw Artifacts Data:</h2>
      <pre>{JSON.stringify(artifacts, null, 2)}</pre>
    </div>
  )
}