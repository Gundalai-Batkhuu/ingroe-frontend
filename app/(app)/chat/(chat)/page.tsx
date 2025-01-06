import { nanoid } from '@/lib/utils';
import { Chat } from '@/features/chat/components/chat';
import { AI } from '@/features/chat/actions/ai-actions';
import { getMissingKeys } from '@/features/chat/actions/server-actions';
import { checkAuth } from '@/features/authentication/auth-utils';

export const metadata = {
	title: 'Ingroe'
};

export default async function IndexPage() {
	const id = nanoid();
	const session = await checkAuth();

	const missingKeys = await getMissingKeys();

	return (
		<AI initialAIState={{ chatId: id, messages: [] }}>
			<Chat id={id} session={session} missingKeys={missingKeys} />
		</AI>
	);
}
