import { auth } from '@/features/authentication/auth'
import { Session } from '@/lib/types'
import ArtifactsPageContent from '@/features/dashboard/components/artifacts-page-content'

export default async function ArtifactsPage() {
  const session = (await auth()) as Session
  const userId = session.user.id
  const searchParams = {q:'', offset:'0'}
  return (
    <ArtifactsPageContent  searchParams={searchParams} userId={userId}/>
  );
}

