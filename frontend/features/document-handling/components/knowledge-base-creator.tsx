'use client'

import { useState } from 'react'
import { Upload, Link, PenTool, File, Plus, X, Search } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { CreateDocumentButton } from '@/features/document-handling/components/create-document-button'

type Document = {
  id: string
  type: 'file' | 'link' | 'note' | 'search'
  content: string
}

type SearchResult = {
  id: string
  title: string
  url: string
}

interface KnowledgeBaseCreatorProps {
  userId: string
}

export default function KnowledgeBaseCreator({
  userId
}: KnowledgeBaseCreatorProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [documents, setDocuments] = useState<Document[]>([])
  const [fileInput, setFileInput] = useState<string>('')
  const [linkInput, setLinkInput] = useState<string>('')
  const [noteInput, setNoteInput] = useState<string>('')
  const [searchInput, setSearchInput] = useState<string>('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  const addDocument = (
    type: 'file' | 'link' | 'note' | 'search',
    content: string
  ) => {
    const newDocument: Document = {
      id: Date.now().toString(),
      type,
      content
    }
    setDocuments([...documents, newDocument])
  }

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addDocument('file', file.name)
      setFileInput('')
    }
  }

  const handleLinkAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (linkInput.trim()) {
      addDocument('link', linkInput.trim())
      setLinkInput('')
    }
  }

  const handleNoteAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (noteInput.trim()) {
      addDocument('note', noteInput.trim())
      setNoteInput('')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Example Search Result 1',
          url: 'https://example.com/1'
        },
        {
          id: '2',
          title: 'Example Search Result 2',
          url: 'https://example.com/2'
        },
        {
          id: '3',
          title: 'Example Search Result 3',
          url: 'https://example.com/3'
        }
      ]
      setSearchResults(mockResults)
    }
  }

  const handleSearchResultAdd = (result: SearchResult) => {
    addDocument('search', `${result.title} (${result.url})`)
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
                  {documents.map(doc => (
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
                        {doc.type === 'search' && (
                          <Search className="h-4 w-4 mr-2" />
                        )}
                        {doc.content}
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="file">Files</TabsTrigger>
                <TabsTrigger value="link">Web Links</TabsTrigger>
                <TabsTrigger value="note">Notes</TabsTrigger>
                <TabsTrigger value="search">Google Search</TabsTrigger>
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
                <form onSubmit={handleNoteAdd} className="space-y-2">
                  <Textarea
                    placeholder="Enter your notes"
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    rows={4}
                  />
                  <Button type="submit" className="w-full">
                    Add Note
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="search" className="mt-4 space-y-4">
                <h2 className="text-lg font-semibold">Google Search</h2>
                <form
                  onSubmit={handleSearch}
                  className="flex items-center space-x-2"
                >
                  <Input
                    type="text"
                    placeholder="Enter search query"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" aria-label="Search">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <ul className="space-y-2">
                    {searchResults.map(result => (
                      <li
                        key={result.id}
                        className="flex items-center justify-between bg-muted p-2 rounded"
                      >
                        <span className="flex items-center">
                          <Checkbox
                            id={`search-${result.id}`}
                            className="mr-2"
                          />
                          <label
                            htmlFor={`search-${result.id}`}
                            className="text-sm"
                          >
                            {result.title}
                          </label>
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSearchResultAdd(result)}
                        >
                          Add
                        </Button>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="p-6">
        <CreateDocumentButton
          user_id={userId}
          links={documents.map(doc => doc.content)}
          document_alias={title}
          description={description}
        />
      </div>
    </div>
  )
}
