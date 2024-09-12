import React from 'react'
import SearchPageContent from '@/features/google-search/components/search-page-content'
import { auth } from '@/auth'
import { Session } from '@/lib/types'

export default async function SearchPage() {
  const session = (await auth()) as Session | null

  if (!session || !session.user) {
    // Handle unauthenticated state
    return <div>Please log in to access the search page</div>
  }

  const userId = session.user.id

  return (
    <SearchPageContent userId={userId} />
  )
}