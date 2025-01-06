import EditArtifactPageContent from '@/features/worker-creation/components/edit-artifact-page-content';
import React from 'react';
import { checkAuth } from '@/features/authentication/auth-utils';

export default async function EditArtifactPage({
	params
}: {
	params: { id: string };
}) {
	const session = await checkAuth();
	const userId = session.user.id;

	return <EditArtifactPageContent params={params} userId={userId} />;
}
