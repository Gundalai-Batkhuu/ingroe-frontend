'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Artefact } from '@/lib/types'

interface ArtifactEditModeProps {
  editedArtifact: Artefact
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  handleAddItem: (field: string) => void
}

export function ArtifactEditMode({
  editedArtifact,
  handleInputChange,
  handleAddItem
}: ArtifactEditModeProps) {
  const isFileLink = (link: string): boolean => {
    const fileExtensions = [
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.txt',
      '.csv',
      '.zip',
      '.rar'
    ]
    return (
      fileExtensions.some(ext => link.toLowerCase().endsWith(ext)) ||
      link.includes('/download/') ||
      link.includes('/file/')
    )
  }

  return (
    <div className="grid w-full items-center gap-4">
      <ArtifactEditField
        label="Document Name"
        name="document_name"
        value={editedArtifact.document_name}
        onChange={handleInputChange}
      />
      <ArtifactEditField
        label="Description"
        name="description"
        value={editedArtifact.description}
        onChange={handleInputChange}
        isTextarea
      />
      <ArtifactListField
        label={'Web links'}
        value={[
          ...editedArtifact.vanilla_links,
          ...editedArtifact.file_links
        ].join(', ')}
        onAdd={() => handleAddItem('web_links')}
      />
      <ArtifactListField
        label="Files"
        value={editedArtifact.files.join(', ')}
        onAdd={() => handleAddItem('files')}
      />
      <ArtifactListField
        label="Captured Documents"
        value={editedArtifact.captured_documents
          .map(doc => doc.captured_document_id)
          .join(', ')}
        onAdd={() => handleAddItem('captured_documents')}
      />
    </div>
  )
}

interface ArtifactListFieldProps {
  label: string
  value: string
  onAdd: () => void
}

function ArtifactListField({ label, value, onAdd }: ArtifactListFieldProps) {
  return (
    <div className="flex flex-col space-y-1.5 text-sm">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        <Button variant="ghost" size="sm" onClick={onAdd} className="h-8 px-2">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      <div className="p-2 bg-secondary rounded-md">{value}</div>
    </div>
  )
}

interface ArtifactEditFieldProps {
  label: string
  name: string
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  isTextarea?: boolean
}

function ArtifactEditField({
  label,
  name,
  value,
  onChange,
  isTextarea = false
}: ArtifactEditFieldProps) {
  return (
    <div className="flex flex-col space-y-1.5 text-sm">
      <Label htmlFor={name}>{label}</Label>
      {isTextarea ? (
        <Textarea id={name} name={name} value={value} onChange={onChange} />
      ) : (
        <Input id={name} name={name} value={value} onChange={onChange} />
      )}
    </div>
  )
}
