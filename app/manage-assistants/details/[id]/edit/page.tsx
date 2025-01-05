import { Session } from '@/lib/types';
import { auth } from '@/features/authentication/auth';
import EditArtifactPageContent from '@/features/worker-creation/components/edit-artifact-page-content';
import React from 'react';

export default async function EditArtifactPage({
	params
}: {
	params: { id: string };
}) {
	const session = (await auth()) as Session | null;

	if (!session || !session.user) {
		return <div>Please log in to access the search page</div>;
	}
	const userId = session.user.id;

	return <EditArtifactPageContent params={params} userId={userId} />;
}
