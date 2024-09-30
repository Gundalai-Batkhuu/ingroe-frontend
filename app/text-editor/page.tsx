import React from 'react'
import { auth } from '@/features/authentication/auth'
import { Session } from '@/lib/types'
import TextEditorPageContent from '@/features/handwriting-recognition/components/text-editor-page-content'
import { SidebarHandwrittenProps } from '@/features/handwriting-recognition/components/sidebar-handwritten'

export default async function TextEditorPage() {
  const session = (await auth()) as Session
  const userId = session.user.id
  const sidebarHandwritten: SidebarHandwrittenProps = {
    userId: userId,
    setText: (text: string) => {},
    setEditedText: (text: string) => {},
    editedText: ''
  }

return (
      // <SidebarHandwritten sidebarHandwritten/>
      <TextEditorPageContent userId={userId} />
)
}