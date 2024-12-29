import * as React from 'react';

import Link from 'next/link';
import { clearChats, getChats } from '@/features/chat/actions/server-actions';
import { ClearHistory } from './clear-history';
import { SidebarItems } from './sidebar-items';
import { cache } from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { IconPlus } from '@/components/ui/icons';
import { Skeleton } from '@/components/ui/skeleton';
interface ChatHistoryProps {
	userId?: string;
}

const loadChats = cache(async (userId?: string) => {
	return await getChats(userId);
});

export async function ChatHistory({ userId }: ChatHistoryProps) {
	const chats = await loadChats(userId);

	return (
		<div className="flex h-full flex-col">
			<Link
				href="/chat"
				className={cn(
					buttonVariants({ variant: 'outline' }),
					'mb-4 h-10 w-full justify-start bg-zinc-50 px-2 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10'
				)}
			>
				<IconPlus className="-translate-x-2 stroke-2" />
				New Chat
			</Link>

			<div className="min-h-0 flex-1">
				<React.Suspense
					fallback={
						<div className="h-full space-y-4 overflow-y-auto px-4">
							{Array.from({ length: 10 }).map((_, i) => (
								<Skeleton key={i} className="h-6 w-full" />
							))}
						</div>
					}
				>
					<div className="flex h-full flex-col">
						<div className="overflow-y flex-1">
							{chats?.length ? (
								<div className="space-y-2 px-2">
									<SidebarItems chats={chats} />
								</div>
							) : (
								<div className="p-8 text-center">
									<p className="text-sm text-muted-foreground">
										No chat history
									</p>
								</div>
							)}
						</div>

						<div className="flex items-center justify-between p-4">
							<ClearHistory
								clearChats={clearChats}
								isEnabled={chats?.length > 0}
							/>
						</div>
					</div>
				</React.Suspense>
			</div>
		</div>
	);
}
