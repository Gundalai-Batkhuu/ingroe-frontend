import { auth } from '@/features/authentication/auth';
import { ChatHistory } from '@/features/chat/components/chat-history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export async function ChatSidebarContainer() {
	const session = await auth();

	if (!session?.user?.id) {
		return null;
	}

	return (
		<aside className="h-full w-96">
			<Tabs
				defaultValue="chats"
				className="flex h-full w-full flex-col justify-between bg-background p-4 dark:bg-zinc-950"
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
		</aside>
	);
}
