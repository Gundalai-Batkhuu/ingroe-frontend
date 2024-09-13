import React from 'react'
import { auth } from '@/features/authentication/auth'
import { Session } from '@/lib/types'
import TextEditorPageContent from '@/features/handwriting-recognition/components/text-editor-page-content'

export default async function TextEditorPage() {
  const session = (await auth()) as Session
  const userId = session.user.id

  return (

      <TextEditorPageContent userId={userId} />
  )
}