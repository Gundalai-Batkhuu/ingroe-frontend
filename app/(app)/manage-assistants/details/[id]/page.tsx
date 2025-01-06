import { checkAuth } from '@/features/authentication/auth-utils';
import AssistantDetails from '@/features/workers-collection/components/assistant-details';


export default async function AssistantDetailsPage({
	params
}: {
	params: { id: string };
}) {
	const session = await checkAuth();

	const userId = session.user.id;
	const searchParams = { q: '', offset: '0' };

	return <AssistantDetails searchParams={searchParams} userId={userId} assistantId={params.id} />;
}
