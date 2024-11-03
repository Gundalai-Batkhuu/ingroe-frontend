
import { auth } from '@/features/authentication/auth'
import { Session } from '@/lib/types'
import React from 'react'
import WorkerCreator from '@/features/worker-creation/components/worker-creator'


export default async function CreateWorkerPage() {
  const session = (await auth()) as Session | null

  if (!session || !session.user) {
    return <div> Please log in to access the search page </div>
  }
  const userId = session.user.id
  
  return (
    <WorkerCreator userId={userId}/>
  )
}