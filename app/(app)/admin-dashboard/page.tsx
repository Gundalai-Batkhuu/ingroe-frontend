import AdminDashboardContent from '@/features/admin-dashboard/dashboard-content';
import { checkAuth } from '@/features/authentication/auth-utils';

export default async function AdminDashboardPage() {
	const session = await checkAuth();
	return <AdminDashboardContent />;
}
