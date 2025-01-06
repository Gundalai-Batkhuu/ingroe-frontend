import React from 'react';
import { ChatSidebarContainer } from '@/features/chat/components/chat-sidebar-container';

interface ChatLayoutProps {
	children: React.ReactNode;
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
	return (
		<div className="flex h-full">
			<aside className="fixed left-0 top-0 z-50 flex h-screen w-[25%] flex-col border-r border-gray-100 lg:w-[20%] xl:w-[15%]">
				<ChatSidebarContainer />
			</aside>
			<main className="ml-[25%] w-[75%] flex-1 lg:ml-[20%] lg:w-[80%] xl:ml-[15%] xl:w-[85%]">
				{children}
			</main>
		</div>
	);
}
