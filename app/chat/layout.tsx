import React from 'react';
import { ChatSidebarContainer } from '@/features/chat/components/chat-sidebar-container';

interface ChatLayoutProps {
	children: React.ReactNode;
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
	return (
		<div className="flex h-full">
			<main className="flex-1">{children}</main>
			<ChatSidebarContainer />
		</div>
	);
}
