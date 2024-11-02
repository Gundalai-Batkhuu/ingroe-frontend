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
import { WorkerCreationButton } from '@/features/worker-creation/components/worker-creation-button'
import { NewWorkerDialog } from '@/features/worker-creation/components/new-worker-dialog'
import WebSearchContainer from "@/features/google-search/components/web-search-container";
import { useResourceItemsStore } from '@/features/worker-creation/stores/useResourceItemsStore'
import { FileWithPath } from 'react-dropzone'
import HandwrittenNotesEditor from "@/features/handwriting-recognition/components/handwritten-notes-content";
import { FileUploader } from '@/features/worker-creation/components/file-uploader'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface WorkerCreatorProps {
  userId: string
}

export default function WorkerCreator({
  userId
}: WorkerCreatorProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [noteFileInput, setNoteFileInput] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(true)
  
  const { resourceItems, addResourceItem, removeResourceItem, clearResourceItems } = useResourceItemsStore()

  const handleFileUpload = (files: FileWithPath[]) => {
    files.forEach(file => {
      addResourceItem('file', file)
    })
  }

  const handleNoteFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addResourceItem('note', file)
      setNoteFileInput('')
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-hidden">
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
                <TabsTrigger value="web-links">Web Links</TabsTrigger>
                <TabsTrigger value="electronics">Electronic Files</TabsTrigger>
                <TabsTrigger value="note">Handwritten Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="file" className="mt-4 space-y-4 px-4 sm:px-6 lg:px-8">
                <FileUploader onFileUpload={handleFileUpload} />
              </TabsContent>
              <TabsContent value="electronics" className="mt-4 space-y-4 px-4 sm:px-6 lg:px-8">
                
              </TabsContent>
              <TabsContent value="note" className="mt-4">
                <HandwrittenNotesEditor userId={userId} />
              </TabsContent>
              <TabsContent value="web-links">
                <WebSearchContainer userId={userId} />
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
