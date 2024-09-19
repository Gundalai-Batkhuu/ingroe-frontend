'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserArtifactsStore } from '@/stores/userArtifactsStore'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash, Plus, Edit } from 'lucide-react'
import { Artefact } from '@/lib/types'
import { UpdateDocumentInfo } from '@/features/document-handling/components/update-document-info'

interface EditArtifactPageContentProps {
  params: { id: string }
  userId: string
}
export default function EditArtifactPageContent({ params, userId }: EditArtifactPageContentProps) {

  const router = useRouter()
  const { artifacts, updateArtifact, removeArtifact, setSelectedArtifactId } = useUserArtifactsStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editedArtifact, setEditedArtifact] = useState<Artefact | null>(null)

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

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (artifacts) {
      const originalArtifact = artifacts.artefact_tree.find(a => a.document_id === params.id)
      setEditedArtifact(originalArtifact || null)
    }
  }

  const handleSave = () => {
    if (!editedArtifact) return

    UpdateDocumentInfo({ updatedArtifact: editedArtifact, userId: userId })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this artifact?')) return

    removeArtifact(params.id)
    router.push('/') // Redirect to the main page after deletion
  }

  const handleAdd = () => {
    router.push('/new-artifact') // Redirect to the new artifact page
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedArtifact) return
    const { name, value } = e.target
    setEditedArtifact(prev => prev ? ({ ...prev, [name]: value }) : null)
  }

  if (!editedArtifact) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
        <div>
          <CardTitle className={"mb-2"}>Edit Database Artifact</CardTitle>
          <CardDescription >View and edit artifact details.</CardDescription>
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
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5 text-sm">
            <Label htmlFor="document_name">Document Name</Label>
            {isEditing ? (
              <Input
                id="document_name"
                name="document_name"
                value={editedArtifact.document_name}
                onChange={handleInputChange}
              />
            ) : (
              <div className="p-2 bg-secondary rounded-md">{editedArtifact.document_name}</div>
            )}
          </div>
          <div className="flex flex-col space-y-1.5 text-sm">
            <Label htmlFor="description">Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                name="description"
                value={editedArtifact.description}
                onChange={handleInputChange}
              />
            ) : (
              <div className="p-2 bg-secondary rounded-md">{editedArtifact.description}</div>
            )}
          </div>
          <div className="flex flex-col space-y-1.5 text-sm">
            <Label htmlFor="vanilla_links">Vanilla Links</Label>
            <div className="p-2 bg-secondary rounded-md">
              {editedArtifact.vanilla_links.map((link, index) => (
                <div key={index}>{link}</div>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-1.5 text-sm">
            <Label htmlFor="file_links">File Links</Label>
            <div className="p-2 bg-secondary rounded-md">
              {editedArtifact.file_links.map((link, index) => (
                <div key={index}>{link}</div>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-1.5 text-sm">
            <Label htmlFor="files">Files</Label>
            <div className="p-2 bg-secondary rounded-md">
              {editedArtifact.files.map((file, index) => (
                <div key={index}>{file}</div>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-1.5 text-sm">
            <Label>Captured Documents</Label>
            <div className="p-2 bg-secondary rounded-md">
              {editedArtifact.captured_documents.map((doc) => (
                <div key={doc.doc_id}>{doc.captured_document_id}</div>
              ))}
            </div>
          </div>
        </div>
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
  )
}