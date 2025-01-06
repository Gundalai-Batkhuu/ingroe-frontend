import WorkersPageContent from '@/features/workers-collection/components/workers-page-content';
import { checkAuth } from '@/features/authentication/auth-utils';

export default async function WorkersPage() {
	const session = await checkAuth();

	const userId = session.user.id;
	const searchParams = { q: '', offset: '0' };
	return <WorkersPageContent searchParams={searchParams} userId={userId} />;
}
