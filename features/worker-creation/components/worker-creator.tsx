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
<<<<<<<< HEAD:features/worker-creation/components/worker-creator.tsx
import { WorkerCreationButton } from '@/features/worker-creation/components/worker-creation-button'
import { NewWorkerDialog } from '@/features/worker-creation/components/new-worker-dialog'
========
import { DocumentCreationButton } from '@/features/worker-creation/components/document-creation-button'
import { NewDocumentDialog } from '@/features/worker-creation/components/new-document-dialog'
>>>>>>>> d56de1a (Rename knowledge base to worker):features/worker-creation/components/document-creator.tsx
import SearchPageContent from "@/features/google-search/components/search-page-content";
import { useResourceItemsStore } from '@/features/worker-creation/stores/useResourceItemsStore'
import { FileWithPath } from 'react-dropzone'
import HandwrittenNotesEditor from "@/features/handwriting-recognition/components/handwritten-notes-content";
import { FileUploader } from '@/features/worker-creation/components/file-uploader'
<<<<<<<< HEAD:features/worker-creation/components/worker-creator.tsx
========
import { Alert, AlertDescription } from '@/components/ui/alert'
>>>>>>>> d56de1a (Rename knowledge base to worker):features/worker-creation/components/document-creator.tsx

interface WorkerCreatorProps {
  userId: string
}

export default function WorkerCreator({
  userId
}: WorkerCreatorProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [linkInput, setLinkInput] = useState<string>('')
  const [noteFileInput, setNoteFileInput] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const { resourceItems, addResourceItem, removeResourceItem, clearResourceItems } = useResourceItemsStore()

  useEffect(() => {
    setIsDialogOpen(true)
  }, [])

  const handleFileUpload = (files: FileWithPath[]) => {
    files.forEach(file => {
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
            <CardTitle>{title || 'Worker name'}</CardTitle>
            <CardDescription>
              {description || 'Worker description'}
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
                <FileUploader onFileUpload={handleFileUpload} />
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
              <TabsContent value="note" className="mt-4">
                <HandwrittenNotesEditor userId={userId} />
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
            <WorkerCreationButton
              userId={userId} 
              title={title || ''}
              description={description || ''}
              className="flex-1"
            />
          </CardFooter>
        </Card>
      </div>
                
      <NewWorkerDialog
        setDescription={setDescription}
        setTitle={setTitle}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}
