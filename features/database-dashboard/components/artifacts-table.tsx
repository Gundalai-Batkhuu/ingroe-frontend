import React, { useState } from 'react'
import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
  TableCell
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {Artefact, ShareDocument} from '@/lib/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { DeleteDocumentButton } from '@/features/document-handling/components/delete-doc-button'
import SelectArtifactAndChatButton from '@/features/chat/components/select-artifact-and-chat'
import { ShareDocumentDialog } from "@/features/document-handling/components/share-document-dialog"
import {documentService} from "@/services/document-service";
import { useToast } from "@/hooks/use-toast"

export function ArtifactsTable({
  artifacts,
  offset,
  totalArtifacts,
  userId,
  onArtifactsChange
}: {
  artifacts: Artefact[]
  offset: number
  totalArtifacts: number
  userId: string
  onArtifactsChange: () => void
}) {
  const router = useRouter()
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{ id: string, name: string } | null>(null)
  const { toast } = useToast()

  function prevPage() {
    router.push(`/?offset=${Math.max(0, offset - 5)}`, { scroll: false })
  }

  function nextPage() {
    router.push(`/?offset=${offset + 5}`, { scroll: false })
  }

  const handleDeleteSuccess = () => {
    onArtifactsChange()
  }

  const handleEditArtifact = (artifactId: string) => {
    router.push(`/databases/${artifactId}`)
  }

  const handleShareArtifact = (documentId: string, documentName: string) => {
    setSelectedDocument({ id: documentId, name: documentName })
    setIsShareDialogOpen(true)
  }

  const handleShareSubmit = (email: string) => {
    if (selectedDocument) {
      try {
        const shareDocument: ShareDocument = {
          document_id: selectedDocument.id,
          user_id: userId,
          open_access: false,
          accessor_emails: [email]
        }
        documentService.shareDocument(shareDocument)
         toast({
          title: "Document shared successfully",
          description: `Shared "${selectedDocument.name}" with ${email}`,
        })
      } catch (error) {
        console.error(error)
      }
    } else {
      console.error("No document selected to share")
    }
    setSelectedDocument(null)
    setIsShareDialogOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Databases</CardTitle>
          <CardDescription>
            Manage your knowledge bases and view their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead className="hidden md:table-cell">Web links</TableHead>
                <TableHead className="hidden md:table-cell">Files</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
                <TableHead>
                  <span className="sr-only">Chat</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artifacts.map(artifact => (
                <TableRow key={artifact.document_id}>
                  <TableCell>{artifact.document_name}</TableCell>
                  <TableCell>{artifact.description}</TableCell>
                  <TableCell>{artifact.vanilla_links.length}</TableCell>
                  <TableCell>
                    {artifact.files.length + artifact.file_links.length}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onSelect={() =>
                            handleEditArtifact(artifact.document_id)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handleShareArtifact(artifact.document_id, artifact.document_name)
                          }
                        >
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DeleteDocumentButton
                            document_id={artifact.document_id}
                            user_id={userId}
                            onSuccess={handleDeleteSuccess}
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <SelectArtifactAndChatButton
                      artifactId={artifact.document_id}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <form className="flex items-center w-full justify-between">
            <div className="text-xs text-muted-foreground">
              Showing{' '}
              <strong>
                {offset + 1}-{Math.min(offset + 5, totalArtifacts)}
              </strong>{' '}
              of <strong>{totalArtifacts}</strong> artifacts
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
      <ShareDocumentDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        onShare={handleShareSubmit}
      />
    </>
  )
}