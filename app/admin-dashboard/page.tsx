import { auth } from '@/features/authentication/auth'
import { Session } from '@/lib/types'
import AdminDashboardContent from '@/features/admin-dashboard/dashboard-content'

export default async function AdminDashboardPage() {
  const session = (await auth()) as Session

  if (!session || !session.user) {
    return <div> Please log in</div>
  }
  
  const userId = session.user.id
  return (
    <AdminDashboardContent/>
  );
}

    