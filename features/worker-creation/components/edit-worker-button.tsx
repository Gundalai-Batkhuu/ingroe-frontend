import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'

interface EditWorkerButtonProps {
  documentId: string
  onEdit: (documentId: string) => void
}

export function EditWorkerButton({ documentId, onEdit }: EditWorkerButtonProps) {
  return (
    <Button 
      variant="destructive"
      size="smIcon" 
      onClick={() => onEdit(documentId)}
      className="bg-blue-500 hover:bg-blue-500/90"
    >
      <Pencil className="size-4" />
    </Button>
  )
}