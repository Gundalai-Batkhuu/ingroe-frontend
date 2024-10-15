import React, { useState, useEffect } from 'react'
import { SearchResult } from '@/lib/types'
import { truncateText } from '@/lib/utils'
import { useResourceItemsStore } from '@/features/document-creation/stores/useResourceItemsStore'


interface SearchResultsListProps {
  searchResults: SearchResult[]
}

export const SearchResultsList = ({
  searchResults,
}: SearchResultsListProps) => {
  const { addResourceItem, removeResourceItem, resourceItems } = useResourceItemsStore()
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    setSelectedItems(new Set(resourceItems.map(item => item.content as string)))
  }, [resourceItems])

  const handleToggle = (result: SearchResult) => {
    if (selectedItems.has(result.link)) {
      const itemToRemove = resourceItems.find(item => item.content === result.link)
      if (itemToRemove) {
        removeResourceItem(itemToRemove.id)
      }
    } else {
      addResourceItem('link', result.link)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {searchResults.map((result, index) => (
        <div key={index} className="mb-12 flex items-center justify-between">
          <div className="grow pr-4">
            <div className="flex items-center mb-1">
              {result.thumbnail && (
                <img
                  src={result.thumbnail}
                  alt=""
                  className="size-8 mr-2 rounded-full"
                />
              )}
              <div className="overflow-hidden">
                <a
                  href={result.link}
                  className="text-sm text-primary/80 hover:underline block whitespace-nowrap overflow-hidden text-overflow-ellipsis"
                  title={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {truncateText(result.link, 80)}
                </a>
              </div>
            </div>
            <h3 className="text-xl mb-1">
              <a
                href={result.link}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.title}
              </a>
            </h3>
            <p
              className="text-sm text-primary/70"
              dangerouslySetInnerHTML={{
                __html: result.html_snippet || result.snippet
              }}
            />
          </div>
          <div className="shrink-0">
            <input
              type="checkbox"
              className="size-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              checked={selectedItems.has(result.link)}
              onChange={() => handleToggle(result)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
