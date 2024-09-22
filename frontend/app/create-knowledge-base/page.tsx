import KnowledgeBaseCreator from '@/features/document-handling/components/knowledge-base-creator'
import { auth } from '@/features/authentication/auth'
import { Session } from '@/lib/types'
import React from 'react'


export default async function CreateKnowledgeBasePage() {
  const session = (await auth()) as Session | null

  if (!session || !session.user) {
    return <div>Please log in to access the search page</div>
  }
  const userId = session.user.id

  return (
    <KnowledgeBaseCreator userId={userId}/>
  )
}