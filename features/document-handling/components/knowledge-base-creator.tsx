'use client'

import React, { useState } from 'react'
import { Upload, Link, PenTool, File, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { CreateDocumentButton } from '@/features/document-handling/components/create-document-button'

type ResourceItem =
  | { id: string; type: 'file' | 'note'; content: File; displayName: string }
  | { id: string; type: 'link'; content: string; displayName: string }

interface KnowledgeBaseCreatorProps {
  userId: string
}

export default function KnowledgeBaseCreator({
  userId
}: KnowledgeBaseCreatorProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [resourceItems, setResourceItems] = useState<ResourceItem[]>([])
  const [fileInput, setFileInput] = useState<string>('')
  const [linkInput, setLinkInput] = useState<string>('')
  const [noteFileInput, setNoteFileInput] = useState<string>('')

  const addResource = (
    type: 'file' | 'link' | 'note',
    content: File | string
  ) => {
    const newResource: ResourceItem =
      type === 'link'
        ? {
            id: Date.now().toString(),
            type,
            content: content as string,
            displayName: content as string
          }
        : {
            id: Date.now().toString(),
            type,
            content: content as File,
            displayName: (content as File).name
          };
    setResourceItems([...resourceItems, newResource])
  }

  const removeDocument = (id: string) => {
    setResourceItems(resourceItems.filter(doc => doc.id !== id))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addResource('file', file)
      setFileInput('')
    }
  }

  const handleLinkAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (linkInput.trim()) {
      addResource('link', linkInput.trim())
      setLinkInput('')
    }
  }

  const handleNoteFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addResource('note', file)
      setNoteFileInput('')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex gap-6 p-6">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Create New Knowledge Base</CardTitle>
            <CardDescription>
              Enter details and add documents to your knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kb-title">Title</Label>
                <Input
                  id="kb-title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter knowledge base title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kb-description">Description</Label>
                <Textarea
                  id="kb-description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter knowledge base description"
                  rows={3}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Uploaded Documents</h3>
              <ScrollArea className="w-full rounded-md border p-4">
                <ul className="space-y-2">
                  {resourceItems.map(doc => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between bg-muted p-2 rounded"
                    >
                      <span className="flex items-center">
                        {doc.type === 'file' && (
                          <File className="h-4 w-4 mr-2" />
                        )}
                        {doc.type === 'link' && (
                          <Link className="h-4 w-4 mr-2" />
                        )}
                        {doc.type === 'note' && (
                          <PenTool className="h-4 w-4 mr-2" />
                        )}
                        {doc.displayName}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeDocument(doc.id)}
                        aria-label={`Remove ${doc.type}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        <Card className="w-1/2">
          <CardContent className="p-6">
            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="file">Files</TabsTrigger>
                <TabsTrigger value="link">Web Links</TabsTrigger>
                <TabsTrigger value="note">Handwritten Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="file" className="mt-4 space-y-4">
                <h2 className="text-lg font-semibold">Upload Files</h2>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    value={fileInput}
                    className="flex-1"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-6 w-6 text-gray-500" />
                    <span className="sr-only">Upload file</span>
                  </label>
                </div>
              </TabsContent>
              <TabsContent value="link" className="mt-4 space-y-4">
                <h2 className="text-lg font-semibold">Add Web Links</h2>
                <form
                  onSubmit={handleLinkAdd}
                  className="flex items-center space-x-2"
                >
                  <Input
                    type="url"
                    placeholder="Enter URL"
                    value={linkInput}
                    onChange={e => setLinkInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" aria-label="Add link">
                    <Plus className="h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="note" className="mt-4 space-y-4">
                <h2 className="text-lg font-semibold">Add Handwritten Notes</h2>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    onChange={handleNoteFileUpload}
                    value={noteFileInput}
                    className="flex-1"
                    id="note-file-upload"
                  />
                  <label htmlFor="note-file-upload" className="cursor-pointer">
                    <Upload className="h-6 w-6 text-gray-500" />
                    <span className="sr-only">Upload handwritten note</span>
                  </label>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="p-6">
        <CreateDocumentButton
          userId={userId}
          title={title}
          description={description}
          resourceItems={resourceItems}/>
      </div>
    </div>
  )
}