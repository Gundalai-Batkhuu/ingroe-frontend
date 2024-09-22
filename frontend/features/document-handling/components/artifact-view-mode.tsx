'use client'

import { Label } from '@/components/ui/label'
import { Artefact } from '@/lib/types'

interface ArtifactViewModeProps {
  artifact: Artefact
}

export function ArtifactViewMode({ artifact }: ArtifactViewModeProps) {
  return (
    <div className="grid w-full items-center gap-4">
      <ArtifactField label="Document Name" value={artifact.document_name} />
      <ArtifactField label="Description" value={artifact.description} />
      <ArtifactField label="Vanilla Links" value={artifact.vanilla_links.join(', ')} />
      <ArtifactField label="File Links" value={artifact.file_links.join(', ')} />
      <ArtifactField label="Files" value={artifact.files.join(', ')} />
      <ArtifactField
        label="Captured Documents"
        value={artifact.captured_documents.map(doc => doc.captured_document_id).join(', ')}
      />
    </div>
  )
}

interface ArtifactFieldProps {
  label: string
  value: string
}

function ArtifactField({ label, value }: ArtifactFieldProps) {
  return (
    <div className="flex flex-col space-y-1.5 text-sm">
      <Label>{label}</Label>
      <div className="p-2 bg-secondary rounded-md">{value}</div>
    </div>
  )
}