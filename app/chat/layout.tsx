import React from 'react'
import { ChatHistoryContainer } from '@/features/chat/components/chat-history-container'
import { DocumentViewerSidebarContainer } from '@/features/google-search/components/document-viewer-sidebar-container'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
      <ChatHistoryContainer />
      <main className="flex-1 overflow-hidden">{children}</main>
      <DocumentViewerSidebarContainer />
    </div>
  )
}