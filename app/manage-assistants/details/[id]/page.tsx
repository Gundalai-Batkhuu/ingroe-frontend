import { auth } from '@/features/authentication/auth';
import { Session } from '@/lib/types';
import AssistantDetails from '@/features/workers-collection/components/assistant-details';


export default async function AssistantDetailsPage({
	params
}: {
	params: { id: string };
}) {
	const session = (await auth()) as Session;

	if (!session || !session.user) {
		return <div> Please log in</div>;
	}

	const userId = session.user.id;
	const searchParams = { q: '', offset: '0' };

	return <AssistantDetails searchParams={searchParams} userId={userId} assistantId={params.id} />;
}
