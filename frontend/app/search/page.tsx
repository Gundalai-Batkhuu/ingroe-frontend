import React from 'react'
import SearchPageContent from '@/app/components/search-page-content'
import { auth } from '@/auth'
import { Session } from '@/app/lib/types'

export default async function SearchPage() {
  const session = (await auth()) as Session
  const userId = session.user.id

  return (
    <SearchPageContent userId={userId} />
  )
}
