import { auth } from '@/features/authentication/auth';
import { ChatHistory } from '@/features/chat/components/chat-history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatSearch } from './chat-search';

export async function ChatSidebarContainer() {
	const session = await auth();

	if (!session?.user?.id) {
		return null;
	}

	return (
		<>
			<ChatSearch className="relative mx-auto flex w-full bg-background px-6 py-4 md:grow-0" />
			<Tabs
				defaultValue="chats"
				className="flex flex-1 flex-col justify-between bg-background px-4 dark:bg-zinc-950"
			>
				<TabsList>
					<TabsTrigger value="chats" className="text-md w-1/3">
						Chats
					</TabsTrigger>
					<TabsTrigger value="notes" className="text-md w-1/3">
						Notes
					</TabsTrigger>
					<TabsTrigger value="pinned" className="text-md w-1/3">
						Pinned
					</TabsTrigger>
				</TabsList>
				<TabsContent value="chats" className="mt-8 h-full">
					<ChatHistory userId={session.user.id} />
				</TabsContent>
				<TabsContent value="notes" className="mt-8 h-full">
					<span>Notes</span>
				</TabsContent>
				<TabsContent value="pinned" className="mt-8 h-full">
					<span>Pinned</span>
				</TabsContent>
			</Tabs>
		</>
	);
}
