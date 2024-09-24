import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { CreateDocumentButton } from '@/features/document-handling/components/create-document-button'
import { useSelectedItemsStore } from '@/stores/selectedItemsStore'
import { TextInputWithClearButton } from '@/components/ui/text-input-with-clear-button'

export interface SidebarProps extends React.ComponentProps<'div'> {
  userId: string
}

type ResourceItem =
  | { id: string; type: 'file' | 'note'; content: File; displayName: string }
  | { id: string; type: 'link'; content: string; displayName: string }

export function SidebarSelectedDocuments({ className, userId }: SidebarProps) {
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
    <div
      className={cn(
        className,
        'h-full flex-col dark:bg-zinc-950'
      )}
    >
      <div className="flex flex-col h-full inset-y-0 border-l lg:w-[250px] xl:w-[300px] bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl overflow-hidden">
        <div className="w-full h-full overflow-y-auto flex flex-col justify-between">
          <div className="w-full max-w-md p-4 space-y-5">
            {selectedItems.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-center items-center">
                  <p className="text-center text-primary">
                    {selectedItems.length} item
                    {selectedItems.length > 1 ? 's' : ''} selected
                  </p>
                </div>
                <ul className="space-y-4">
                  {selectedItems.map((item, index) => (
                    <li
                      key={index}
                      className="bg-white/10 p-3 rounded flex justify-between items-start"
                    >
                      <div>
                        <div className="font-medium text-blue-400">
                          {item.title}
                        </div>
                        <div className="text-sm text-primary/70 break-all mt-1">
                          {item.link}
                        </div>
                      </div>
                      <button
                        onClick={() => removeSelectedItem(item)}
                        className="text-gray-400 hover:text-white transition-colors w-6 h-6 flex items-center justify-center"
                        aria-label="Remove item"
                      >
                        &#10005;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {selectedItems.length > 0 && (
            <div className="p-4 flex flex-col items-center space-y-4">
              <div className="w-full space-y-4">
                <TextInputWithClearButton
                  placeholder="Enter title..."
                  onChange={setTitle}
                />
                <TextInputWithClearButton
                  placeholder="Enter description... (optional)"
                  onChange={setDescription}
                />
              </div>
              <CreateDocumentButton
                userId={userId}
                title={title}
                description={description}
                resourceItems={resourceItems}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}