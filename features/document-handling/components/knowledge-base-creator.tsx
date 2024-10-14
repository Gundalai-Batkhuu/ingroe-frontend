'use client'

import React, { useEffect, useState } from 'react'
import { Upload, Link, PenTool, File, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CreateDocumentButton } from '@/features/document-handling/components/create-document-button'
import { NewDocumentDialog } from '@/features/document-handling/components/new-document-dialog'
import SearchPageContent from "@/features/google-search/components/search-page-content";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    setIsDialogOpen(true)
  }, [])

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
          }
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
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex-1 flex gap-6">
        <Card className="w-3/4">
          <CardHeader>
            <CardTitle>{title || 'Database name'}</CardTitle>
            <CardDescription>
              {description || 'Database description'}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6">
            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="file">Files</TabsTrigger>
                <TabsTrigger value="link">Web Links</TabsTrigger>
                <TabsTrigger value="note">Handwritten Notes</TabsTrigger>
                <TabsTrigger value="search">Web Search</TabsTrigger>
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
              <TabsContent value="search" className="mt-4 space-y-4">
                <SearchPageContent userId={userId} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="w-1/4 flex flex-col h-full">
          <CardHeader>
            <CardTitle>Uploads</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <ul className="space-y-2 p-4">
                {resourceItems.map(doc => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between bg-muted p-2 rounded"
                  >
                    <span className="flex items-center">
                      {doc.type === 'file' && <File className="size-4 mr-2" />}
                      {doc.type === 'link' && <Link className="size-4 mr-2" />}
                      {doc.type === 'note' && (
                        <PenTool className="size-4 mr-2" />
                      )}
                      {doc.displayName}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeDocument(doc.id)}
                      aria-label={`Remove ${doc.type}`}
                    >
                      <X className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between gap-4 p-4">
            <Button
              variant="outline"
              onClick={() => setResourceItems([])}
              disabled={resourceItems.length === 0}
              className="flex-1"
            >
              Clear All
            </Button>
            <CreateDocumentButton
              userId={userId} 
              title={title || ''}
              description={description || ''}
              resourceItems={resourceItems}
              className="flex-1"
            />
          </CardFooter>
        </Card>
      </div>
                
      <NewDocumentDialog
        setDescription={setDescription}
        setTitle={setTitle}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}
