import { auth } from '@/features/authentication/auth';
import { ChatHistory } from '@/features/chat/components/chat-history';

export async function ChatHistoryContainer() {
	const session = await auth();

	if (!session?.user?.id) {
		return null;
	}

	return <ChatHistory userId={session.user.id} />;
}
