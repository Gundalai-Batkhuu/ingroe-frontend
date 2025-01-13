'use client';

import { UIState } from '@/features/chat/actions/ai-actions';
import { useScrollAnchor } from '@/hooks/use-scroll-anchor';
import { useAIState } from 'ai/rsc';
import { LoadingDots } from '../../../components/ui/loading-dots';

export interface ChatList {
	messages: UIState;
}

export function ChatList({ messages }: ChatList) {
	const { messagesRef, scrollRef, visibilityRef } = useScrollAnchor();
	const [aiState] = useAIState();

	return (
		<div
			ref={scrollRef}
			className="relative mx-auto max-w-2xl overflow-y-auto px-4"
		>
			<div className="space-y-4 pb-4">
				{messages.map((message, index) => (
					<div key={message.id}>{message.display}</div>
				))}

				{aiState.isLoading && <LoadingDots />}
			</div>

			<div ref={messagesRef} />
			<div ref={visibilityRef} className="h-px w-full" />
		</div>
	);
}
