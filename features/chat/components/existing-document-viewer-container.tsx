import { auth } from '@/features/authentication/auth';
import { UserArtifactsList } from '@/features/chat/components/user-artifacts-list';
import { Card } from '@/components/ui/card';

export async function ExistingDocumentViewerContainer() {
	const session = await auth();

	if (!session?.user?.id) {
		return null;
	}

	return (
		<Card className="absolute right-0 flex h-[calc(100vh-6rem)] flex-col p-4 dark:bg-zinc-950 lg:flex lg:w-[250px] xl:w-[300px]">
			<UserArtifactsList userId={session.user.id} />
		</Card>
	);
}
