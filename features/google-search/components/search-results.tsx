import React from 'react'
import { SearchResult } from '@/lib/types'
import { truncateText } from '@/lib/utils'


export const SearchResultsList = ({
  results,
  selectedItems,
  setSelectedItems
}: {
  results: SearchResult[],
  selectedItems: SearchResult[],
  setSelectedItems: React.Dispatch<React.SetStateAction<SearchResult[]>>
}) => {
  const toggleItemSelection = (result: SearchResult) => {
    setSelectedItems(prev =>
      prev.includes(result)
        ? prev.filter(item => item !== result)
        : [...prev, result]
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {results.map((result, index) => (
        <div key={index} className="mb-12 flex items-center justify-between">
          <div className="flex-grow pr-4">
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
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              checked={selectedItems.includes(result)}
              onChange={() => toggleItemSelection(result)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}