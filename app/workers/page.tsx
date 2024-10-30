import { auth } from '@/features/authentication/auth'
import { Session } from '@/lib/types'
import WorkersPageContent from '@/features/workers-collection/components/workers-page-content'

export default async function WorkersPage() {
  const session = (await auth()) as Session
  const userId = session.user.id
  const userEmail = session.user.email
  const searchParams = {q:'', offset:'0'}
  return (
    <WorkersPageContent  searchParams={searchParams} userId={userId} userEmail={userEmail} />
  );
}

