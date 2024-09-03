import React from 'react'
import { auth } from '@/auth'
import { Session } from '@/app/lib/types'
import TextEditorPageContent from '@/app/components/text-editor-page-content'

export default async function TextEditorPage() {
  const session = (await auth()) as Session
  const userId = session.user.id

  return (
      <TextEditorPageContent userId={userId} />
  )
}