import React from 'react'
import { auth } from '@/features/authentication/auth'
import { Session } from '@/lib/types'
import HandwrittenNotesEditor from '@/features/handwriting-recognition/components/handwritten-notes-content'

export default async function TextEditorPage() {
  
  const session = (await auth()) as Session
  
  if (!session || !session.user) {
    return <div> Please log in</div>
  }

  const userId = session.user.id
  return (
      <HandwrittenNotesEditor userId={userId} />
  )
}