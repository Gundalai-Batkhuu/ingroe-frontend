import React from 'react'
import { auth } from '@/auth'
import { Session } from '@/app/lib/types'

export const UserNameDisplay: React.FC = async () => {
  const session = (await auth()) as Session | null

  if (!session || !session.user) {
    return <span>Guest</span>
  }

  const username = session.user.email?.split('@')[0] || 'User'

  return <span>{username}</span>
}