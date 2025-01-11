import { UIState } from '@/features/chat/actions/ai-actions';
import { Session } from '@/lib/types';
import Link from 'next/link';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useScrollAnchor } from '@/hooks/use-scroll-anchor';

export interface ChatList {
	messages: UIState;
	session?: Session;
	isShared: boolean;
}

export function ChatList({ messages, session, isShared }: ChatList) {
	const { messagesRef, scrollRef, visibilityRef } = useScrollAnchor();

	if (!messages.length) {
		return null;
	}

	return (
		<div 
			ref={scrollRef} 
			className="relative mx-auto max-w-2xl px-4 overflow-y-auto"
		>
			{messages.map((message, index) => (
				<div key={message.id}>{message.display}</div>
			))}
			
			<div ref={messagesRef} />
			<div ref={visibilityRef} className="h-px w-full" />
		</div>
	);
}
