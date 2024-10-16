import React from 'react'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SharedDocumentLoaned } from '@/lib/types'

interface SharedArtifactLoanedProps {
    sharedArtifact: SharedDocumentLoaned
    isExpanded: boolean
    isSelected: boolean
    onToggleExpand: () => void
    onSelect: () => void
}

export function SharedArtifactLoaned({
                                         sharedArtifact,
                                         isExpanded,
                                         isSelected,
                                         onToggleExpand,
                                         onSelect,
                                     }: SharedArtifactLoanedProps) {
    return (
        <div className={cn(
            'border rounded-lg overflow-hidden',
            isSelected ? 'border-blue-500' : 'border-gray-200'
        )}>
            <div className="flex items-center p-2 bg-gray-50 cursor-pointer" onClick={onSelect}>
                <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2"
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggleExpand()
                    }}
                >
                    {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                </Button>
                <FileText className="size-4 mr-2 text-blue-500" />
                <span className="font-medium">{sharedArtifact.document_alias}</span>
                {sharedArtifact.validity ? (
                    <span className="ml-auto text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
            Valid
          </span>
                ) : (
                    <span className="ml-auto text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
            Invalid
          </span>
                )}
            </div>
            {isExpanded && (
                <div className="p-2 bg-white">
                    <p className="text-sm text-gray-600 mb-2">{sharedArtifact.description}</p>
                </div>
            )}
        </div>
    )
}