import { CheckSquare, Square } from 'lucide-react'
import * as React from 'react'

interface QuickSearchCheckboxProps {
  quickSearchMode: boolean
  setQuickSearchMode: (value: boolean) => void
}


export function QuickSearchCheckbox({ quickSearchMode, setQuickSearchMode }: QuickSearchCheckboxProps) {
  const toggleCheckbox = () => {
    setQuickSearchMode(!quickSearchMode)
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleCheckbox}
        className="focus:outline-none"
        aria-checked={quickSearchMode}
        role="checkbox"
      >
        {quickSearchMode ? (
          <CheckSquare className="size-6 text-blue-500" />
        ) : (
          <Square className="size-6 text-gray-400" />
        )}
      </button>
      <span>Quick Search</span>
    </div>
  )
}