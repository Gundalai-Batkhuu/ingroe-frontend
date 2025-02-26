import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { checkAuth } from '@/features/authentication/auth-utils';
import {
	getChat,
	getMissingKeys
} from '@/features/chat/actions/server-actions';
import { Chat } from '@/features/chat/components/chat';
import { AI } from '@/features/chat/actions/ai-actions';

export interface ChatPageProps {
	params: {
		id: string;
	};
}

export async function generateMetadata({
	params
}: ChatPageProps): Promise<Metadata> {
	const session = await checkAuth();

	const chat = await getChat(params.id as string, session.user.id as string);
	return {
		title: chat?.title.toString().slice(0, 50) ?? 'Chat'
	};
}

export default async function ChatPage({ params }: ChatPageProps) {
	const session = await checkAuth();
	const missingKeys = await getMissingKeys();

	const userId = session.user.id as string;
	const chat = await getChat(params.id as string, userId);

	if (!chat) {
		redirect('/');
	}

	if (chat?.userId !== session?.user?.id) {
		notFound();
	}

	return (
		<AI initialAIState={{ 
			chatId: chat.id, 
			messages: chat.messages,
			isLoading: false 
		}}>
			<Chat
				id={chat.id}
				session={session}
				initialMessages={chat.messages}
				missingKeys={missingKeys}
			/>
		</AI>
	);
}
