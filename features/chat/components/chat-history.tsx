import * as React from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { ChatHistoryItemsList } from '@/features/chat/components/chat-history-items-list';
import { buttonVariants } from '@/components/ui/button';
import { IconPlus } from '@/components/ui/icons';
import { Card } from '@/components/ui/card';

interface ChatHistoryProps {
	userId?: string;
}

export async function ChatHistory({ userId }: ChatHistoryProps) {
	return (
		<Card
			className={cn(
				'absolute flex h-[calc(100vh-6rem)] flex-col p-4 dark:bg-zinc-950 lg:flex lg:w-[250px] xl:w-[300px]'
			)}
		>
			<div className="flex items-center justify-between p-4">
				<h4 className="font-bold">Chat History</h4>
			</div>
			<div className="mb-2 px-2">
				<Link
					href="/chat"
					className={cn(
						buttonVariants({ variant: 'outline' }),
						'h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10'
					)}
				>
					<IconPlus className="-translate-x-2 stroke-2" />
					New Chat
				</Link>
			</div>
			<React.Suspense
				fallback={
					<div className="flex flex-1 flex-col space-y-4 overflow-auto px-4">
						{Array.from({ length: 10 }).map((_, i) => (
							<div
								key={i}
								className="h-6 w-full shrink-0 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800"
							/>
						))}
					</div>
				}
			>
				<ChatHistoryItemsList userId={userId} />
			</React.Suspense>
		</Card>
	);
}
