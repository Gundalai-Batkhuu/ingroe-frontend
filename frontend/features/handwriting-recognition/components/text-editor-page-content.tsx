'use client'

import { TextEditor } from '@/features/handwriting-recognition/components/text-editor'
import { useState } from 'react'
import { SidebarHandwritten } from '@/features/handwriting-recognition/components/sidebar-handwritten'

interface TextEditorPageContentProps {
  userId: string
}

export default function TextEditorPageContent({
  userId
}: TextEditorPageContentProps) {
  const [text, setText] = useState('<p>Initial text</p>')
  const [editedText, setEditedText] = useState(text)

  return (
    <div className="flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
      <SidebarHandwritten userId={userId}  editedText={editedText} setText={setText} setEditedText={setEditedText}/>

      <div className="flex flex-col md:flex-row gap-4 p-4 h-[calc(100%_-_4rem)]">
        <div className="flex-1 min-w-0 overflow-auto">
          <div
            className="h-full border rounded p-4"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
        <div className="w-1/2 min-w-0">
          <TextEditor
            value={editedText}
            onChange={setEditedText}
            className="size-full border rounded"
          />
        </div>
      </div>
    </div>
  )
}


