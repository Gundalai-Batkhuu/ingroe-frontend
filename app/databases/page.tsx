import { auth } from '@/features/authentication/auth'
import { Session } from '@/lib/types'
import ArtifactsPageContent from '@/features/document-collection/components/artifacts-page-content'

export default async function ArtifactsPage() {
  const session = (await auth()) as Session
  const userId = session.user.id
  const userEmail = session.user.email
  const searchParams = {q:'', offset:'0'}
  return (
    <ArtifactsPageContent  searchParams={searchParams} userId={userId} userEmail={userEmail} />
  );
}

