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
import { DocumentCreationButton } from '@/features/document-creation/components/document-creation-button'
import { NewDocumentDialog } from '@/features/document-creation/components/new-document-dialog'
import SearchPageContent from "@/features/google-search/components/search-page-content";
import { useResourceItemsStore } from '@/features/document-creation/stores/useResourceItemsStore'
import { FileWithPath } from 'react-dropzone'

interface KnowledgeBaseCreatorProps {
  userId: string
}

export default function DocumentCreator({
  userId
}: KnowledgeBaseCreatorProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fileInput, setFileInput] = useState<string>('')
  const [linkInput, setLinkInput] = useState<string>('')
  const [noteFileInput, setNoteFileInput] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const { resourceItems, addResourceItem, removeResourceItem, clearResourceItems } = useResourceItemsStore()

  useEffect(() => {
    setIsDialogOpen(true)
  }, [])

  const handleFileUpload = (acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach(file => {
      addResourceItem('file', file)
    })
  }

  const handleLinkAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (linkInput.trim()) {
      addResourceItem('link', linkInput.trim())
      setLinkInput('')
    }
  }

  const handleNoteFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addResourceItem('note', file)
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
              <TabsContent value="file" className="mt-4 space-y-4 px-4 sm:px-6 lg:px-8">
                <h2 className="text-lg font-semibold">Upload Files and Folders</h2>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const files = Array.from(e.dataTransfer.files)
                    handleFileUpload(files as FileWithPath[])
                  }}
                >
                  <Input
                    type="file"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      handleFileUpload(files as FileWithPath[])
                    }}
                    multiple
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">
                      Drag and drop files or folders here, or click to select
                    </p>
                  </label>
                </div>
              </TabsContent>
              <TabsContent value="link" className="mt-4 space-y-4 px-4 sm:px-6 lg:px-8">
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
                    <Plus className="size-4" />
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="note" className="mt-4 space-y-4 px-4 sm:px-6 lg:px-8">
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
                    <Upload className="size-6 text-gray-500" />
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
                {resourceItems.map(resource => (
                  <li
                    key={resource.id}
                    className="flex items-center justify-between bg-muted p-2 rounded"
                  >
                    <span className="flex items-center">
                      {resource.type === 'file' && <File className="size-4 mr-2" />}
                      {resource.type === 'link' && <Link className="size-4 mr-2" />}
                      {resource.type === 'note' && (
                        <PenTool className="size-4 mr-2" />
                      )}
                      {resource.displayName}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeResourceItem(resource.id)}
                      aria-label={`Remove ${resource.type}`}
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
              onClick={clearResourceItems}
              disabled={resourceItems.length === 0}
              className="flex-1"
            >
              Clear All
            </Button>
            <DocumentCreationButton
              userId={userId} 
              title={title || ''}
              description={description || ''}
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
