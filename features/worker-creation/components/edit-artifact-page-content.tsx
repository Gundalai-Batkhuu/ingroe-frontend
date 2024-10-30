'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { userArtifactsStore } from '@/stores/userArtifactsStore'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash, Plus, Edit, X } from 'lucide-react'
import { Artefact } from '@/lib/types'
import { UpdateDocumentInfo } from '@/features/worker-creation/components/update-worker-info'
import { ArtifactEditMode } from '@/features/worker-creation/components/edit-worker-mode'
import { ArtifactViewMode } from '@/features/worker-creation/components/view-worker-mode'
import { LinkDocumentUploader } from '@/features/worker-creation/components/link-document-uploader'
import { FileDocumentUploader } from '@/features/worker-creation/components/file-document-uploader'

interface EditArtifactPageContentProps {
  params: { id: string }
  userId: string
}

export default function EditArtifactPageContent({ params, userId }: EditArtifactPageContentProps) {
  const router = useRouter()
  const { artifacts, updateArtifact, removeArtifact, setSelectedArtifactId } = userArtifactsStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editedArtifact, setEditedArtifact] = useState<Artefact | null>(null)
  const [showSideCard, setShowSideCard] = useState(false)
  const [activeField, setActiveField] = useState<string | null>(null)

  useEffect(() => {
    if (artifacts) {
      const artifact = artifacts.artefact_tree.find(a => a.document_id === params.id)
      if (artifact) {
        setEditedArtifact(artifact)
        setSelectedArtifactId(artifact.document_id)
      } else {
        console.error('Artifact not found')
        router.push('/')
      }
    }
  }, [artifacts, params.id, setSelectedArtifactId, router])

  const handleEdit = () => setIsEditing(true)
  const handleCancel = () => {
    setIsEditing(false)
    if (artifacts) {
      const originalArtifact = artifacts.artefact_tree.find(a => a.document_id === params.id)
      setEditedArtifact(originalArtifact || null)
    }
    setShowSideCard(false)
    setActiveField(null)
  }

  const handleSave = () => {
    if (!editedArtifact) return
    UpdateDocumentInfo({ updatedArtifact: editedArtifact, userId: userId })
    setIsEditing(false)
    setShowSideCard(false)
    setActiveField(null)
  }

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this artifact?')) return
    removeArtifact(params.id)
    router.push('/')
  }

  const handleAdd = () => router.push('/new-artifact')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedArtifact) return
    const { name, value } = e.target
    setEditedArtifact(prev => prev ? ({ ...prev, [name]: value }) : null)
  }

  const handleAddItem = (field: string) => {
    setShowSideCard(true)
    setActiveField(field)
  }

  const handleCloseSideCard = () => {
    setShowSideCard(false)
    setActiveField(null)
  }

  if (!editedArtifact) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
          <div>
            <CardTitle className={"mb-2"}>Edit Database Artifact</CardTitle>
            <CardDescription>View and edit artifact details.</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isEditing && (
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit info</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleDelete}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Add New</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <ArtifactEditMode
              editedArtifact={editedArtifact}
              handleInputChange={handleInputChange}
              handleAddItem={handleAddItem}
            />
          ) : (
            <ArtifactViewMode artifact={editedArtifact} />
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={handleEdit}>Edit</Button>
          )}
        </CardFooter>
      </Card>

      {showSideCard && (
        <Card className="w-full max-w-md ml-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
            <CardTitle>Add New {activeField?.replace('_', ' ')}</CardTitle>
            <Button size="icon" variant="ghost" onClick={handleCloseSideCard}>
              <X className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {activeField === 'web_links'? (
              <LinkDocumentUploader userId={userId} documentId={params.id} />
            ) : activeField === 'files' ? (
              <FileDocumentUploader userId={userId} documentId={params.id} />
            ) :
              (
              // Add your form fields here based on the activeField
              <div>Form fields for {activeField}</div>
            )}
          </CardContent>
          {activeField !== 'files' && activeField !== 'web_links' && (
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCloseSideCard}>Cancel</Button>
              <Button onClick={() => {/* Handle save logic */}}>Add</Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  )
}