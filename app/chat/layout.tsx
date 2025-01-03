import React from 'react';
import { ChatSidebarContainer } from '@/features/chat/components/chat-sidebar-container';

interface ChatLayoutProps {
	children: React.ReactNode;
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
	return (
		<div className="flex h-full">
			<aside className="fixed top-0 left-0 flex flex-col h-screen w-[25%] lg:w-[20%] xl:w-[15%] z-50 border-r border-gray-100">
				<ChatSidebarContainer />
			</aside>
			<main className="w-[75%] ml-[25%] lg:w-[80%] lg:ml-[20%] xl:w-[85%] xl:ml-[15%] flex-1 p-4">{children}</main>
		</div>
	);
}
