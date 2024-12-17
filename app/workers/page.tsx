import { auth } from '@/features/authentication/auth'
import { Session } from '@/lib/types'
import WorkersPageContent from '@/features/workers-collection/components/workers-page-content'

export default async function WorkersPage() {
  const session = (await auth()) as Session

  if (!session || !session.user) {
    return <div> Please log in</div>
  }

  const userId = session.user.id
  const searchParams = {q:'', offset:'0'}
    return (
    <WorkersPageContent  searchParams={searchParams} userId={userId} />
  );
}

