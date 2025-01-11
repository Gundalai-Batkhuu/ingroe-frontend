'use client';

import { cn } from '@/lib/utils';
import { ChatList } from './chat-list';
import { ChatPanel } from './chat-panel';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useEffect, useState } from 'react';
import { useUIState, useAIState } from 'ai/rsc';
import { Message, Session } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';
import { useScrollAnchor } from '@/hooks/use-scroll-anchor';
import { useToast } from '@/components/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmptyScreen } from '@/features/chat/components/empty-screen';
import { Notebook } from 'lucide-react';
import { Options } from './options';
import { userArtifactsStore } from '@/stores/userArtifactsStore';

export interface ChatProps extends React.ComponentProps<'div'> {
	initialMessages?: Message[];
	id?: string;
	session?: Session;
	missingKeys: string[];
}

export function Chat({ id, className, session, missingKeys }: ChatProps) {
	const router = useRouter();
	const path = usePathname();
	const [input, setInput] = useState('');
	const [messages] = useUIState();
	const [aiState] = useAIState();
	const { toast } = useToast();
	const selectedDocument = userArtifactsStore(state =>
		state.getSelectedArtifact()
	);

	const [_, setNewChatId] = useLocalStorage('newChatId', id);

	useEffect(() => {
		if (session?.user && path) {
			if (!path.includes('chat') && messages.length === 1) {
				window.history.replaceState({}, '', `/chat/${id}`);
			}
		}
	}, [id, path, session?.user, messages]);

	useEffect(() => {
		const messagesLength = aiState.messages?.length;
		if (messagesLength === 2) {
			router.refresh();
		}
	}, [aiState.messages, router]);

	useEffect(() => {
		setNewChatId(id);
	});

	useEffect(() => {
		missingKeys.forEach(key => {
			toast({
				variant: 'destructive',
				title: 'Configuration Error',
				description: `Missing ${key} environment variable!`
			});
		});
	}, [missingKeys, toast]);

	const {
		messagesRef,
		scrollRef
	} = useScrollAnchor();

	return (
		<div className="flex h-full w-full flex-col rounded-lg bg-background">
			<div className="mx-auto flex h-20 w-full items-center justify-center border-b border-gray-200">
				<div className="mx-10 flex w-full flex-row items-center justify-center">
					<div className="ml-4 flex-1 text-lg font-bold">
						{selectedDocument?.document_name}
					</div>
					<Notebook className="mr-4 w-10 text-gray-400" />
					<Options />
				</div>
			</div>

			{/* Message Area*/}
			{messages.length ? (
				<ScrollArea
					className="group w-full flex-1 overflow-auto"
					ref={scrollRef}
				>
					<div
						className={cn('pb-[200px] pt-4 md:pt-10', className)}
						ref={messagesRef}
					>
						<ChatList
							messages={messages}
						/>
					</div>
				</ScrollArea>
			) : (
				<EmptyScreen />
			)}

			{/* Chat Panel - always at bottom */}
			<ChatPanel input={input} setInput={setInput} />
		</div>
	);
}
