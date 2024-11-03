'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Bot,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Artefact } from '@/lib/types'
import { DeleteWorkerButton } from '@/features/worker-creation/components/delete-worker-button'
import { WorkerChatButton } from '@/features/chat/components/chat-with-worker-button'
import { userArtifactsStore } from '@/stores/userArtifactsStore'
import { EditWorkerButton } from '@/features/worker-creation/components/edit-worker-button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface TableRowData {
  captured_document_id: string
  captured_files?: Array<{
    file_url: string
    file_name: string
  }>
  query_ready: boolean
}

export function AvailableWorkersTable({
  searchParams,
  userId
}: {
  searchParams: { q: string; offset: string }
  userId: string
}) {
  const router = useRouter()

  const { artifacts, isLoading, error, fetchUserArtifacts } = userArtifactsStore()
  const search = searchParams.q ?? ''
  const offset = parseInt(searchParams.offset ?? '0', 10)

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  const toggleCard = (documentId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [documentId]: !prev[documentId]
    }))
  }

  useEffect(() => {
    fetchUserArtifacts(userId)
  }, [fetchUserArtifacts, userId])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!artifacts) return <div>No artifacts found</div>

  const filteredArtifacts = artifacts.artefact_tree.filter(artifact =>
    artifact.document_name.toLowerCase().includes(search.toLowerCase())
  )

  const paginatedArtifacts = filteredArtifacts.slice(offset, offset + 5)
  const totalArtifacts = filteredArtifacts.length

  function prevPage() {
    router.push(`/?offset=${Math.max(0, offset - 5)}`, { scroll: false })
  }

  function nextPage() {
    router.push(`/?offset=${offset + 5}`, { scroll: false })
  }

  const handleDeleteSuccess = () => {
    fetchUserArtifacts(userId)
  }

  const handleEditArtifact = (artifactId: string) => {
    router.push(`/databases/${artifactId}`)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Workers available</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid gap-4">
          {paginatedArtifacts.map(artifact => (
            <Card key={artifact.document_id}>
              <CardHeader 
                className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
                onClick={() => toggleCard(artifact.document_id)}
              >
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleCard(artifact.document_id)
                    }}
                  >
                    {expandedCards[artifact.document_id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="size-6 text-brand-green" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{artifact.document_name}</CardTitle>
                    <CardDescription>Created date: 01 Nov 2024</CardDescription>
                  </div>
                  {expandedCards[artifact.document_id] && (
                    <div className="flex items-center gap-2">
                      <EditWorkerButton documentId={artifact.document_id} onEdit={handleEditArtifact} />
                      <DeleteWorkerButton
                        document_id={artifact.document_id}
                        user_id={userId}
                        onSuccess={handleDeleteSuccess}
                      />
                    </div>
                  )}
                </div>
                <WorkerChatButton artifactId={artifact.document_id} />
              </CardHeader>
              <CardContent>
        
                {artifact.description && (
                  <p className="mt-4 text-sm text-muted-foreground">{artifact.description}</p>
                )}
                
                {expandedCards[artifact.document_id] && (
                  
                  <div className="mt-4">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">File type</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Modified date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {artifact.captured_documents?.map((doc) => (
                          <TableRow key={doc.captured_document_id}>
                            <TableCell>
                              {doc.captured_files?.map((file) => (
                                <div key={file.file_url} className="text-sm">
                                  {file.file_name.split('.').slice(0, -1).join('.')}
                                </div>
                              ))}
                            </TableCell>
                            <TableCell>
                              {doc.captured_files?.map((file) => {
                                const extension = file.file_name.split('.').pop()?.toLowerCase() || ''
                                return (
                                  <div key={file.file_url} className="text-sm">
                                    {extension}
                                  </div>
                                )
                              })}
                            </TableCell>
                            <TableCell>
                              {doc.query_ready ? 'Ready' : 'Processing'}
                            </TableCell>
                            <TableCell className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              01 Nov 2024
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {offset + 1}-{Math.min(offset + 5, totalArtifacts)}
            </strong>{' '}
            of <strong>{totalArtifacts}</strong> workers
          </div>
          <div className="flex">
            <Button
              onClick={prevPage}
              variant="ghost"
              size="sm"
              disabled={offset === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              onClick={nextPage}
              variant="ghost"
              size="sm"
              disabled={offset + 5 >= totalArtifacts}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  )
}