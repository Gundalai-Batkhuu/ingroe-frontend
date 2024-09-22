import { documentService } from '@/services/document-service'
import { Artefact, DocumentInfo } from '@/lib/types'

interface UpdateDocumentInfoProps {
  updatedArtifact: Artefact
  userId: string

}

export async function UpdateDocumentInfo ({ updatedArtifact, userId }: UpdateDocumentInfoProps) {

  const documentInfo: DocumentInfo = {
    user_id: userId,
    document_id: updatedArtifact.document_id,
    document_alias: updatedArtifact.document_name,
    description: updatedArtifact.description
  }

  try {
    await documentService.updateDocumentInfo(documentInfo)
    console.log("Artifact updated successfully")
  } catch (error) {
    console.error("Failed to update artifact on the server", error)
  }
}