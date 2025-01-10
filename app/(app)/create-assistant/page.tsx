import React from 'react';
import AssistantCreator from '@/features/assistant-creation/components/assistant-creator';
import { checkAuth } from '@/features/authentication/auth-utils';

export default async function CreateAssistantPage() {
	const session = await checkAuth();

	return <AssistantCreator userId={session.user.id} />;
}
