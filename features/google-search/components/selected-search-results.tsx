import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { CreateDocumentButton } from '@/features/document-handling/components/create-document-button'
import { useSelectedItemsStore } from '@/stores/selectedItemsStore'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"

export interface SelectedSearchResultsProps extends React.ComponentProps<'div'> {
  userId: string
}

type ResourceItem =
  | { id: string; type: 'file' | 'note'; content: File; displayName: string }
  | { id: string; type: 'link'; content: string; displayName: string }

export function SelectedSearchResults({ className, userId }: SelectedSearchResultsProps) {
  const { selectedItems, removeSelectedItem } = useSelectedItemsStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // Convert selected items to ResourceItem format
  const resourceItems: ResourceItem[] = selectedItems.map(item => ({
    id: item.link, // Using link as a unique identifier
    type: 'link',
    content: item.link,
    displayName: item.title
  }))

  return (
    <Card className={cn(
      "h-full flex flex-col dark:bg-zinc-950/50 border-l lg:w-[250px] xl:w-[300px] ml-5",
      "backdrop-blur-xl",
      className
    )}>
      <CardHeader>
        <CardTitle className="text-center text-primary">
          {selectedItems.length > 0 ? `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} selected` : 'No items selected'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full">
          <ul className="space-y-4 p-4">
            {selectedItems.map((item, index) => (
              <li key={index}>
                <Card>
                  <CardContent className="p-3 flex justify-between items-start">
                    <div>
                      <div className="font-medium text-blue-400">
                        {item.title}
                      </div>
                      <div className="text-sm text-primary/70 break-all mt-1">
                        {item.link}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSelectedItem(item)}
                      className="h-6 w-6"
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
      {selectedItems.length > 0 && (
        <CardFooter className="flex flex-col items-center space-y-4">
          <div className="w-full space-y-4">
            <Input
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="Enter description... (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <CreateDocumentButton
            userId={userId}
            title={title}
            description={description}
            resourceItems={resourceItems}
          />
        </CardFooter>
      )}
    </Card>
  )
}